import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';
import createApp from '@/lib/create-app';
import env from '@/lib/env';
import * as HttpStatusPhrases from '@/lib/http-status-phrases';
import router from '@/routes/user/user.index';
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { ZodIssueCode } from 'zod';

if (env.NODE_ENV !== 'test') {
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
  const id = 1;

  it('post /users validates the body when creating a user', async () => {
    const response = await client.users.$post({
      // @ts-expect-error
      json: {
        name,
        phone,
        email
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

  it('get /users/{id} validtes the id param', async () => {
    const response = await client.users[':id'].$get({
      param: {
        // @ts-expect-error
        id: 'invalid'
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('id');
      expect(json.error.issues[0].message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_NUMBER
      );
    }
  });

  it('get /users/{id} returns 404 when user not found', async () => {
    const response = await client.users[':id'].$get({
      param: {
        id: 999
      }
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it('get /users/{id} gets a single user', async () => {
    const response = await client.users[':id'].$get({
      param: {
        id
      }
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.phone).toBe(phone);
      expect(json.email).toBe(email);
      expect(json.id).toBe(id);
    }
  });

  it('patch /users/{id} validates the id param', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        // @ts-expect-error
        id: 'invalid'
      },
      json: {}
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('id');
      expect(json.error.issues[0].message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_NUMBER
      );
    }
  });

  it('patch /users/{id} validates the body when updating', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        id
      },
      json: {
        name: ''
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('name');
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });

  it('patch /users/{id} validates empty body', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        id
      },
      json: {}
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it('patch /users/{id} updates a single property of a user', async () => {
    const response = await client.users[':id'].$patch({
      param: {
        id
      },
      json: {
        name: 'Dumbledore'
      }
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe('Dumbledore');
    }
  });

  it('delete /users/{id} validates the id when deleting', async () => {
    const response = await client.users[':id'].$delete({
      param: {
        // @ts-expect-error
        id: 'invalid'
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('id');
      expect(json.error.issues[0].message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_NUMBER
      );
    }
  });
});
