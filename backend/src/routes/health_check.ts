import express from 'express';
import pool from '../db';

const router = express.Router();

router.get('/health-check-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (error) {
    console.error('DB health check failed:', error);
    res.status(500).json({ status: 'error', error });
  }
});

export default router;