import { cloudinary } from '../config/cloudinary';
import { logger } from '../utils/logger';

// ─── Folder Constants ─────────────────────────────────────────────────────
export const CLOUDINARY_FOLDERS = {
  GALLERY: 'high_school_youth_club/gallery',
  EVENTS: 'high_school_youth_club/events',
  MEMBERS: 'high_school_youth_club/members',
  AVATARS: 'high_school_youth_club/avatars',
  NOTICES: 'high_school_youth_club/notices',
  LOGOS: 'high_school_youth_club/logos',
} as const;

export type CloudinaryFolder = typeof CLOUDINARY_FOLDERS[keyof typeof CLOUDINARY_FOLDERS];

// ─── generateUploadSignature ──────────────────────────────────────────────
/**
 * Generates a signed upload signature for Cloudinary Direct Upload.
 * The frontend sends files directly to Cloudinary with this signature.
 * The backend API key never leaves the server.
 */
export function generateUploadSignature(
  folder: CloudinaryFolder = CLOUDINARY_FOLDERS.GALLERY,
  publicId?: string
): {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId?: string;
} {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const params: Record<string, string | number> = {
    timestamp,
    folder,
  };

  if (publicId) {
    params['public_id'] = publicId;
  }

  const signature = cloudinary.utils.api_sign_request(params, process.env['CLOUDINARY_API_SECRET']!);

  return {
    signature,
    timestamp,
    apiKey: process.env['CLOUDINARY_API_KEY']!,
    cloudName: process.env['CLOUDINARY_CLOUD_NAME']!,
    folder,
    ...(publicId && { publicId }),
  };
}

// ─── deleteAsset ──────────────────────────────────────────────────────────
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (err) {
    logger.error('Failed to delete Cloudinary asset:', { publicId, error: (err as Error).message });
    return false;
  }
}

// ─── getOptimizedUrl ──────────────────────────────────────────────────────
export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string | number } = {}
): string {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: options.quality ?? 'auto',
    width: options.width,
    height: options.height,
    crop: options.width || options.height ? 'fill' : undefined,
    secure: true,
  });
}
