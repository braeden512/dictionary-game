import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { setupRoomCreation } from './room_creation';
import { setupRoomCodeEndpoint } from './routes/get_room_code';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupRoomCodeEndpoint(app);
setupRoomCreation(io);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
