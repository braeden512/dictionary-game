import { Server, Socket } from 'socket.io';
import pool from './db';

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

const usersInRooms: { [roomCode: string]: User[] } = {};

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

      socket.join(roomCode);
      const user: User = { id: socket.id, username, isHost };
      if (!usersInRooms[roomCode]) usersInRooms[roomCode] = [];
      usersInRooms[roomCode].push(user);

      // either store user in db or memory

      console.log(`${username} (${socket.id}) joined room ${roomId}${isHost ? ' [HOST]' : ''}`);

      socket.emit('room-joined', { userId: socket.id });

      // only emit the non host users
      const nonHostUsers = usersInRooms[roomCode].filter(u => !u.isHost);
      io.to(roomCode).emit('room-users', nonHostUsers);
    });
    
    socket.on('leave-room', () => {
      for (const roomCode in usersInRooms) {
        const users = usersInRooms[roomCode];
        const updatedUsers = users.filter(u => u.id !== socket.id);
        if (updatedUsers.length !== users.length) {
          usersInRooms[roomCode] = updatedUsers;

          const nonHostUsers = updatedUsers.filter(u => !u.isHost);
          io.to(roomCode).emit('room-users', nonHostUsers);
          console.log(`User ${socket.id} disconnected from room ${roomCode}`);
        }
      }
    });
    // kind of redundant
    socket.on('disconnect', () => {
      for (const roomCode in usersInRooms) {
        const users = usersInRooms[roomCode];
        const updatedUsers = users.filter(u => u.id !== socket.id);
        if (updatedUsers.length !== users.length) {
          usersInRooms[roomCode] = updatedUsers;

          const nonHostUsers = updatedUsers.filter(u => !u.isHost);
          io.to(roomCode).emit('room-users', nonHostUsers);
          console.log(`User ${socket.id} disconnected from room ${roomCode}`);
        }
      }
    })
  });
}
