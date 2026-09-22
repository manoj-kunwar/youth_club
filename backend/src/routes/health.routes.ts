import { Router, Request, Response } from 'express';
import { getDatabaseStatus } from '../config/database';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

const handleHealth = (req: Request, res: Response) => {
  const db = getDatabaseStatus();
  sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
    database: {
      connected: db.connected,
      readyState: db.readyState,
    },
    uptime: process.uptime(),
    version: '1.0.0',
  });
};

// Health check — confirms API and DB are alive
router.get('/health', handleHealth);
router.get('/', handleHealth);

export default router;
