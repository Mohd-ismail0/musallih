import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  JWT_SECRET: z.string().min(24, 'JWT_SECRET must be at least 24 characters'),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(900),
  JOBS_ENABLED: z
    .string()
    .optional()
    .transform((v) => (v ?? 'true').toLowerCase() === 'true'),
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  API_RATE_LIMIT_WINDOW: z.string().default('1 minute'),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((v) =>
      v
        ? v
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : ['http://localhost:3000', 'http://localhost:5173'],
    ),
  // Firebase Admin (required for auth token exchange)
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}
