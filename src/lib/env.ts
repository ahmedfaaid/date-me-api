import { z, ZodError } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(5555),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
}).superRefine((input, ctx) => {
  if (input.NODE_ENV === 'production' && !input.DATABASE_AUTH_TOKEN) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: 'string',
      received: 'undefined',
      path: ['DATABASE_AUTH_TOKEN'],
      message: 'In production environment, DATABASE_AUTH_TOKEN is required.'
    });
  }
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const err = error as ZodError;
  console.error('🔴 Error with env:');
  console.error(err.flatten().fieldErrors);
  process.exit(1);
}

export default env;
