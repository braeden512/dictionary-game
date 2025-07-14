import { Server, Socket } from 'socket.io';
import pool from './db';
import { initializeGame, nextRound, acceptWord, submitDefinition, submitVote, removeGame } from './game_flow';

// function to generate a 6-digit code
function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// track users within memory
interface User {
  id: string;
  username: string;
  isHost: boolean;
}

const gameStarted: { [roomCode: string]: boolean } = {};
const usersInRooms: { [roomCode: string]: User[] } = {};

function getUsersInRoom(roomCode: string): User[] {
  return usersInRooms[roomCode] || [];
}

// function to handle room creation socket events
export function setupRoomCreation(io: Server) {
  io.on('connection', (socket: Socket) => {
    // create a new room
    socket.on('create-room', async () => {
      // could potentially fail if roomCode is not unique
      const roomCode = generateRoomCode();

      const result = await pool.query(
        'INSERT INTO rooms (code, created_at, expires_at) VALUES ($1, NOW(), NOW() + INTERVAL \'1 hour\') RETURNING id', [roomCode]
      );
      const roomId = result.rows[0].id;

      socket.emit('room-created', roomId);
    });

    socket.on('join-room', async ({ roomCode, username, isHost = false }) => {

      // get the id
      const result = await pool.query('SELECT id FROM rooms WHERE code = $1', [roomCode]);
      // verify the room exists
      if (result.rowCount === 0) {
        socket.emit('error', { message: 'Room does not exist.' });
        return;
      }
      const roomId = result.rows[0].id;

      if (!usersInRooms[roomCode])
        usersInRooms[roomCode] = [];

      const currentUsers = usersInRooms[roomCode];

      // check if the room is locked
      if (gameStarted[roomCode]) {
        socket.emit('join-error', { message: 'Game already started. Cannot join.' });
        return;
      }
      // check if the host already exists
      if (isHost && currentUsers.some(user => user.isHost)) {
        socket.emit('join-error', { message: 'Host already exists for this room.' });
        return;
      }

      socket.join(roomCode);
      const user: User = { id: socket.id, username, isHost };
      usersInRooms[roomCode].push(user);

      // either store user in db or memory

      console.log(`${username} (${socket.id}) joined room ${roomId}${isHost ? ' [HOST]' : ''}`);

      socket.emit('room-joined', { userId: socket.id });

      // only emit the non host users
      const nonHostUsers = usersInRooms[roomCode].filter(u => !u.isHost);
      io.to(roomCode).emit('room-users', nonHostUsers);
    });

    socket.on('start-game', ({ roomCode }) => {
      // need to add a catch for when there are 2 or less players in the lobby
      const users = getUsersInRoom(roomCode).filter(u => !u.isHost);

      if (users.length >= 3){
        initializeGame(roomCode, users, io);
        gameStarted[roomCode] = true;
        io.to(roomCode).emit('game-started');
        console.log(`Game started in room ${roomCode}`);
      }
      else {
        // doesn't ever really execute (but good backup I guess)
        socket.emit('not-enough-players', {
          message: 'You need at least three players to start the game.',
        });
      }
    });

    socket.on('next-round', ({ roomCode }) => {
      nextRound(roomCode, io);
    })

    socket.on('submit-word', ({ roomCode, word }) => {
      if (!word || !roomCode)
        return;

      acceptWord(roomCode, word, io);
    })

    socket.on('submit-definition', ({ roomCode, definition }) => {
      submitDefinition(roomCode, socket.id, definition, io);
    });

    socket.on('submit-vote', ({ roomCode, voteIndex }) => {
      submitVote(roomCode, socket.id, voteIndex, io);
    });
    
    const removeUserFromRooms = async () => {
      for (const roomCode in usersInRooms) {
        const users = usersInRooms[roomCode];
        const userLeaving = users.find(u => u.id === socket.id);

        // if the user can't be found
        if (!userLeaving) continue;

        const updatedUsers = users.filter(u => u.id !== socket.id);
        usersInRooms[roomCode] = updatedUsers;

        console.log(`${userLeaving.username} (${socket.id}) left room ${roomCode}${userLeaving.isHost ? ' [HOST]' : ''}`);

        if (gameStarted[roomCode]) {
          // Game has started, so end it for everyone
          io.to(roomCode).emit('room-closed');
          delete usersInRooms[roomCode];
          delete gameStarted[roomCode];
          removeGame(roomCode); // from game_flow.ts
          await pool.query('DELETE FROM rooms WHERE code = $1', [roomCode]);
          console.log(`Game in room ${roomCode} ended because someone left.`);
        } else {
          if (userLeaving.isHost) {
            // End lobby
            io.to(roomCode).emit('room-closed');
            delete usersInRooms[roomCode];
            await pool.query('DELETE FROM rooms WHERE code = $1', [roomCode]);
            console.log(`Host left, closing room ${roomCode}`);
          } else {
            // Update non-host user list
            const nonHostUsers = updatedUsers.filter(u => !u.isHost);
            io.to(roomCode).emit('room-users', nonHostUsers);
          }
        }
      }
    };
    socket.on('leave-room', removeUserFromRooms);
    socket.on('disconnect', removeUserFromRooms);
  });
}
