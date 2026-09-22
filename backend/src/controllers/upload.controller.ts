import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { generateUploadSignature, CLOUDINARY_FOLDERS, CloudinaryFolder } from '../services/cloudinary.service';

import { ForbiddenError } from '../middleware/errorHandler';

// ─── POST /api/v1/uploads/signature ──────────────────────────────────────
/**
 * Returns a signed upload signature for Cloudinary Direct Upload.
 * The client uses this to upload directly to Cloudinary without routing
 * media through the API server (no file payload ever hits Express).
 *
 * Security: Regular members can only upload avatars.
 * Administrative folders (gallery, events, notices, logos) require admin/manager roles.
 */
export const getUploadSignature = asyncHandler(async (req: Request, res: Response) => {
  const folder = ((req.body?.folder || req.query?.folder || 'gallery') as string).trim().toLowerCase();
  const publicId = (req.body?.publicId || req.query?.publicId) as string | undefined;

  const isAvatar = folder.includes('avatar');
  const userRole = req.user?.profile.role;

  if (!isAvatar && userRole === 'MEMBER') {
    throw new ForbiddenError('Members can only upload profile avatars. Administrative upload requires elevated permissions.');
  }

  // Validate folder is a known Cloudinary folder
  const validFolders = Object.values(CLOUDINARY_FOLDERS);
  const cloudinaryFolder = validFolders.find((f) => f.toLowerCase().includes(folder))
    ?? (isAvatar ? CLOUDINARY_FOLDERS.AVATARS : CLOUDINARY_FOLDERS.GALLERY);

  const signature = generateUploadSignature(cloudinaryFolder as CloudinaryFolder, publicId);

  sendSuccess(res, signature, 'Upload signature generated');
});
