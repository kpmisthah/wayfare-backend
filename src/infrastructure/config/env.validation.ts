import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  POSTGRES_DATABASE_URL: z
  .string()
  .min(1)
  .refine((val) => val.startsWith('postgresql://'), {
    message: 'POSTGRES_DATABASE_URL must be a valid PostgreSQL connection string',
  }),

  JWT_SECRET: z.string().min(10),
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES: z.coerce.number(),
  JWT_REFRESH_EXPIRES: z.coerce.number(),


  EMAIL_HOST: z.string().min(1),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASSWORD: z.string().min(1),

  OTP_EXPIRY_TIME: z.coerce.number().min(1),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),

  CLOUDINARY_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),



  OPEN_ROUTER_API: z.string().min(1),

  ELASTICSEARCH_URL: z.string().url().optional(),
  ELASTICSEARCH_USER: z.string().optional(),
  ELASTICSEARCH_PASSWORD: z.string().optional(),
  FRONTEND_URL: z.string().url(),
  NEXT_PUBLIC_WS_URL: z.string().url(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validate = (config: Record<string, unknown>) => {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('Invalid environment variables');
    console.error(result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
};
