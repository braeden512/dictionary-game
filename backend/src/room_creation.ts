import { Server, Socket } from 'socket.io';
import pool from './db';

// function to generate a 6-digit code
function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// function to handle room creation socket events
export function setupRoomCreation(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('create-room', async () => {
      // could potentially fail if roomCode is not unique
      const roomCode = generateRoomCode();

      const result = await pool.query(
        'INSERT INTO rooms (code, created_at) VALUES ($1, NOW()) RETURNING id', [roomCode]
      );
      const roomId = result.rows[0].id;

      socket.emit('room-created', roomId);
    });
  });
}
