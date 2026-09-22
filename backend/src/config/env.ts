import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  API_BASE_URL: z.string().url().default('http://localhost:5000'),

  // MongoDB
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB_NAME: z.string().default('high_school_youth_club'),

  // Supabase (backend)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_JWT_SECRET: z.string().min(1, 'SUPABASE_JWT_SECRET is required'),
  JWT_SECRET: z.string().min(1).optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  // Resend
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM_EMAIL: z.string().email().default('noreply@highschoolyouthclub.org'),
  RESEND_FROM_NAME: z.string().default('High School Youth Club'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('60000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  AUTH_RATE_LIMIT_MAX: z.string().default('10').transform(Number),
  FORM_RATE_LIMIT_MAX: z.string().default('5').transform(Number),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  // Admin
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_REGISTRATION_KEY: z.string().optional(),
});

type EnvConfig = z.infer<typeof envSchema>;

let config: EnvConfig;

function validateEnv(): EnvConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    parsed.error.issues.forEach((issue) => {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error('Environment validation failed. Check .env file against .env.example');
  }

  return parsed.data;
}

// Validate on first import and cache
config = validateEnv();

export { config };
export type { EnvConfig };
