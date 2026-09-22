import crypto from 'crypto';
import { config } from '../config/env';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || config?.SUPABASE_JWT_SECRET;
  if (!secret) {
    throw new Error('JWT signing/verification secret is not configured. Server requires JWT_SECRET or SUPABASE_JWT_SECRET.');
  }
  return secret;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) {
    s += '=';
  }
  return Buffer.from(s, 'base64').toString('utf8');
}

export interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
  sessionId?: string;
  exp?: number;
  iat?: number;
}

export function signJwt(payload: JwtUserPayload, expiresInSeconds: number = 86400 * 7): string {
  const secret = getJwtSecret();
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const h = base64UrlEncode(JSON.stringify(header));
  const p = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${h}.${p}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${h}.${p}.${signature}`;
}

export function verifyJwt(token: string): JwtUserPayload | null {
  try {
    const secret = getJwtSecret();
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [h, p, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${h}.${p}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(p)) as JwtUserPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
