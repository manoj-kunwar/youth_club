import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env';
import {
  register,
  login,
  adminRegister,
  adminLogin,
  getMe,
  logout,
  changePassword,
  getSecurityInfo,
  revokeOtherSessions,
} from '../controllers/auth.controller';
import { verifyAuth } from '../middleware/auth';

const router = Router();

// ─── Rate Limiters ─────────────────────────────────────────────────────────
const isDev = config.NODE_ENV === 'development' || config.NODE_ENV === 'test';

const loginRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 500 : 5, // 5 login attempts per minute in production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please wait a minute before trying again.',
    },
  },
});

const registerRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 500 : 5, // 5 registration attempts per minute in production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many registration attempts. Please wait a minute before trying again.',
    },
  },
});

const changePasswordRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDev ? 500 : 5, // 5 password change attempts per minute in production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many password change attempts. Please wait a minute before trying again.',
    },
  },
});

// ─── Member Authentication ────────────────────────────────────────────────
router.post('/register', registerRateLimit, register);
router.post('/login', loginRateLimit, login);
router.post('/logout', logout);
router.get('/me', verifyAuth, getMe);

// ─── Dedicated Admin Authentication ───────────────────────────────────────
router.post('/admin/register', registerRateLimit, adminRegister);
router.post('/admin/login', loginRateLimit, adminLogin);

// ─── Security & Account Management ────────────────────────────────────────
router.post('/change-password', verifyAuth, changePasswordRateLimit, changePassword);
router.get('/security-info', verifyAuth, getSecurityInfo);
router.post('/sessions/revoke-others', verifyAuth, revokeOtherSessions);

export default router;
