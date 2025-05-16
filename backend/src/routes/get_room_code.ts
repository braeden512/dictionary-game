import { Express, Request, Response } from 'express';
import pool from '../db';

export function setupRoomCodeEndpoint(app: Express) {
  app.get('/api/rooms/:id', async (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response
  ) => {
    const roomId = req.params.id;
    const result = await pool.query('SELECT code FROM rooms WHERE id = $1', [roomId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json({ roomCode: result.rows[0].code });
  });
}