import { Router } from 'express';
import { verifyAuth } from '../middleware/auth';
import { getUploadSignature } from '../controllers/upload.controller';

const router = Router();

// Only authenticated users can get upload signatures
router.get('/signature', verifyAuth, getUploadSignature);
router.post('/signature', verifyAuth, getUploadSignature);

export default router;
