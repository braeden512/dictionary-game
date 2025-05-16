import { Express, Request, Response } from 'express';
import pool from '../db';

export function setupRoomValidationEndpoint(app: Express) {
    app.post('/api/validate-room', async (
        req: Request<{}, {}, { roomCode: string }, {}>,
        res: Response
    ) => {
        const { roomCode } = req.body;

        const result = await pool.query(
            'SELECT id FROM rooms WHERE code = $1 AND expires_at > NOW()',
            [roomCode]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Room not found (or expired)' });
            return;
        }

        res.json({ valid: true, roomId: result.rows[0].id });
    });
}