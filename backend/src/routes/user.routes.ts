import { Router } from 'express';
import { verifyAuth } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import {
  getMyProfile,
  getUsers,
  createUserProfile,
  updateMyProfile,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

// Self-service (any authenticated user)
router.get('/me', verifyAuth, getMyProfile);
router.patch('/me', verifyAuth, updateMyProfile);
router.get('/profile', verifyAuth, getMyProfile);
router.patch('/profile', verifyAuth, updateMyProfile);

// Registration & Admin: Create, list, manage users
router.post('/', createUserProfile); // Called by Supabase webhook or after signup — no auth yet
router.post('/profile', createUserProfile); // Alias matching registration & API docs
router.get('/', verifyAuth, requirePermission('users.read'), getUsers);
router.patch('/:id/role', verifyAuth, requirePermission('users.update'), updateUserRole);
router.delete('/:id', verifyAuth, requirePermission('users.delete'), deleteUser);

export default router;
