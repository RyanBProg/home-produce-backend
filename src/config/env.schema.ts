import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['test', 'dev', 'prod']),
  JWT_SECRET: z.string().min(10),
  LOCAL_DB_URL: z.string(),
  SUPABASE_DB_URL: z.string(),
});

export type EnvVars = z.infer<typeof envSchema>;
