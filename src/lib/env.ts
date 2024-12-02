import { z, ZodError } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(5555),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
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
