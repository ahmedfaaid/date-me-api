import { ZOD_ERROR_MESSAGES } from '@/lib/constants';
import createApp from '@/lib/create-app';
import env from '@/lib/env';
import userRouter from '@/routes/user/user.index';
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import profileRouter from './profile.index';

if (env.NODE_ENV !== 'test') {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(
  createApp().route('/', profileRouter).route('/', userRouter)
);

describe('profile routes', () => {
  const userId = 1;
  const email = 'albus.dumbledore@hogwarts.com';
  const password = 'brackium_emendo';
  const name = 'Albus Dumbledore';
  const phone = '0244555555';
  const bio = 'Headmaster of Hogwarts';
  const birthDate = new Date('1881-07-01').getTime();
  const locationLat = 56.4907;
  const locationLon = -4.2026;

  beforeAll(async () => {
    execSync('bun drizzle-kit push');

    await client.users.$post({
      json: {
        email,
        password
      }
    });
  });

  afterAll(async () => {
    fs.rmSync('test.db', { force: true });
  });

  it('post /profiles validates the body when creating a profile', async () => {
    const response = await client.profiles.$post({
      // @ts-expect-error
      json: {
        bio
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('userId');
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });
});
