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

  const name = 'Albus';
  const phone = '0244555555';
  const email = 'albus@hogwarts.com';
  const password = 'brackium_emendo';

  it('post /users validates the body when creating a user', async () => {
    const response = await client.users.$post({
      // @ts-expect-error
      json: {
        name,
        phone,
        email,
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('password');
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  it('post /users creates a new user', async () => {
    const response = await client.users.$post({
      json: {
        name,
        phone,
        email,
        password
      }
    });
    expect(response.status).toBe(201);
    if (response.status === 201) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.phone).toBe(phone);
      expect(json.email).toBe(email);
    }
  });

  it('get /users lists all users', async () => {
    const response = await client.users.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });
});
