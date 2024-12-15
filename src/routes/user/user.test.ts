import { ZOD_ERROR_MESSAGES } from '@/lib/constants';
import createApp from '@/lib/create-app';
import env from '@/lib/env';
import router from '@/routes/user/user.index';
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { execSync } from "node:child_process";
import fs from "node:fs";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route('/', router));

describe('users routes', () => {
  beforeAll(async () => {
    execSync('bun drizzle-kit push');
  });

  afterAll(async () => {
    fs.rmSync('test.db', { force: true });
  });

  it('post /users validates the body when creating a user', async () => {
    const response = await client.users.$post({
      // @ts-expect-error
      json: {
        name: "Albus",
        phone: "0244555555",
        email: "albus@hogwarts.com",
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('password');
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });
});
