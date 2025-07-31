import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import pool from './db';
import { setupRoomCreation } from './room_creation';
import { setupRoomCodeEndpoint } from './routes/get_room_code';
import { setupRoomValidationEndpoint } from './routes/validate_room';
import healthCheckRoute from './routes/health_check';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://dictionary-game-omega.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(healthCheckRoute);

app.get('/', (_req, res) => {
  res.send('Server is running!');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupRoomCodeEndpoint(app);
setupRoomValidationEndpoint(app);
setupRoomCreation(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// periodic room cleanup
setInterval(async () => {
  await pool.query('DELETE FROM rooms WHERE expires_at < NOW()');
  console.log('Expired rooms cleaned up');
}, 10 * 60 * 1000);
