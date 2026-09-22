import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
// @ts-ignore - ws does not have bundled types
import ws from 'ws';
import { config } from '../config/env';
import UserProfile from '../models/UserProfile.model';
import { UnauthorizedError } from './errorHandler';
import { asyncHandler } from './asyncHandler';
import { verifyJwt } from '../utils/jwt';
import { generateMemberId, generateAdminId } from '../services/idGenerator.service';

// ─── Supabase Admin Client (optional fallback if external Supabase is active) ──
const isSupabaseConfigured =
  config.SUPABASE_URL &&
  !config.SUPABASE_URL.includes('placeholder') &&
  config.SUPABASE_SERVICE_ROLE_KEY &&
  !config.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder');

const supabaseAdmin = isSupabaseConfigured
  ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      realtime: {
        transport: ws as any,
      },
    })
  : null;

// ─── verifyAuth Middleware ────────────────────────────────────────────────
/**
 * Cryptographically validates the Bearer JWT from the Authorization header,
 * loads the verified MongoDB UserProfile, and attaches it to req.user.
 *
 * Security: Always validates signature and loads live profile from database.
 */
export const verifyAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization header is missing or malformed. Expected: Bearer <token>');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('JWT token is missing from Authorization header');
  }

  // 1. Verify standard HS256 JWT issued by application
  const jwtPayload = verifyJwt(token);
  if (jwtPayload && jwtPayload.id) {
    const profile = await UserProfile.findById(jwtPayload.id);
    if (!profile) {
      throw new UnauthorizedError('User account associated with this token was not found');
    }

    if (profile.status === 'suspended') {
      throw new UnauthorizedError('Your account has been suspended. Contact an administrator.');
    }
    if (profile.status === 'inactive') {
      throw new UnauthorizedError('Your account is inactive. Contact an administrator.');
    }

    if (jwtPayload.sessionId) {
      const active = profile.activeSessions && profile.activeSessions.some((s) => s.sessionId === jwtPayload.sessionId);
      if (!active) {
        throw new UnauthorizedError('Your session has been terminated or revoked. Please sign in again.');
      }
    }

    req.sessionId = jwtPayload.sessionId;
    req.user = {
      supabaseId: profile.supabaseUserId || profile._id.toString(),
      email: profile.email,
      profile,
    };
    return next();
  }

  // 2. Fallback: External Supabase JWT Verification if configured
  if (supabaseAdmin) {
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && supabaseUser) {
      let profile = await UserProfile.findOne({
        supabaseUserId: supabaseUser.id,
      });

      if (!profile) {
        // If matching super admin email, auto-create profile
        const isSuperAdminEmail =
          config.SUPER_ADMIN_EMAIL &&
          supabaseUser.email?.toLowerCase() === config.SUPER_ADMIN_EMAIL.toLowerCase();

        const role = isSuperAdminEmail ? 'SUPER_ADMIN' : 'MEMBER';
        const generatedId = isSuperAdminEmail ? await generateAdminId() : await generateMemberId();

        profile = await UserProfile.create({
          supabaseUserId: supabaseUser.id,
          email: supabaseUser.email || config.SUPER_ADMIN_EMAIL,
          fullName: (supabaseUser.user_metadata?.['full_name'] as string) || 'Community Member',
          role,
          memberId: generatedId,
          adminId: isSuperAdminEmail ? generatedId : undefined,
          status: 'active',
        });
      }

      if (profile.status === 'suspended') {
        throw new UnauthorizedError('Your account has been suspended. Contact an administrator.');
      }
      if (profile.status === 'inactive') {
        throw new UnauthorizedError('Your account is inactive. Contact an administrator.');
      }

      req.user = {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email ?? profile.email,
        profile,
      };
      return next();
    }
  }

  throw new UnauthorizedError('Invalid or expired authentication token');
});

// ─── optionalAuth Middleware ──────────────────────────────────────────────
/**
 * Same as verifyAuth but does NOT throw if no token is present.
 * Used for public routes that show extra data when authenticated.
 */
export const optionalAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  // Try standard HS256 JWT
  const jwtPayload = verifyJwt(token);
  if (jwtPayload && jwtPayload.id) {
    const profile = await UserProfile.findById(jwtPayload.id);
    if (profile && profile.status !== 'suspended' && profile.status !== 'inactive') {
      req.user = {
        supabaseId: profile.supabaseUserId || profile._id.toString(),
        email: profile.email,
        profile,
      };
    }
    return next();
  }

  // Try external Supabase if configured
  if (supabaseAdmin) {
    try {
      const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && supabaseUser) {
        const profile = await UserProfile.findOne({
          supabaseUserId: supabaseUser.id,
          status: { $nin: ['suspended', 'inactive'] },
        });

        if (profile) {
          req.user = {
            supabaseId: supabaseUser.id,
            email: supabaseUser.email ?? profile.email,
            profile,
          };
        }
      }
    } catch {
      // Silently ignore auth errors on optional routes
    }
  }

  return next();
});
