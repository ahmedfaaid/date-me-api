import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';
import createApp from '@/lib/create-app';
import env from '@/lib/env';
import * as HttpStatusPhrases from '@/lib/http-status-phrases';
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
      form: {
        profile: JSON.stringify({
          bio
        })
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const paths = [
        'userId',
        'name',
        'phone',
        'bio',
        'birthDate',
        'locationLat',
        'locationLon'
      ];
      const json = await response.json();
      json.error.issues.forEach((issue) => {
        expect(issue.message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
        expect(paths).toContain(issue.path[1]);
      });
    }
  });

  it('post /profiles creates a new profile', async () => {
    const response = await client.profiles.$post({
      form: {
        profile: JSON.stringify({
          userId,
          name,
          phone,
          bio,
          birthDate,
          locationLat,
          locationLon
        })
      }
    });
    expect(response.status).toBe(201);
    if (response.status === 201) {
      const json = await response.json();
      expect(json.userId).toBe(userId);
      expect(json.bio).toBe(bio);
      expect(json.birthDate).toBe(birthDate);
      expect(json.locationLat).toBe(locationLat);
      expect(json.locationLon).toBe(locationLon);
    }
  });

  it('get /profiles/{userId} validates the id param', async () => {
    const response = await client.profiles[':userId'].$get({
      param: {
        // @ts-expect-error
        userId: 'invalid'
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('userId');
      expect(json.error.issues[0].message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_NUMBER
      );
    }
  });

  it('get /profiles/{userId} returns 404 when user not found', async () => {
    const response = await client.profiles[':userId'].$get({
      param: {
        userId: 999
      }
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it('get /profiles/{userId} gets a profile', async () => {
    const response = await client.profiles[':userId'].$get({
      param: {
        userId
      }
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.userId).toBe(userId);
      expect(json.name).toBe(name);
      expect(json.bio).toBe(bio);
      expect(json.birthDate).toBe(birthDate);
      expect(json.locationLat).toBe(locationLat);
      expect(json.locationLon).toBe(locationLon);
    }
  });

  it('patch /profiles/userId validates the id param', async () => {
    const response = await client.profiles[':userId'].$patch({
      param: {
        // @ts-expect-error
        userId: 'invalid'
      },
      json: {}
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe('userId');
      expect(json.error.issues[0].message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_NUMBER
      );
    }
  });

  it('patch /profiles/{userId} validates the body when updating a profile', async () => {
    const response = await client.profiles[':userId'].$patch({
      param: {
        userId
      },
      json: {
        name: ''
      }
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(
        ZOD_ERROR_MESSAGES.INVALID_UPDATES
      );
    }
  });

  it('patch /profiles/{userId} validates empty body', async () => {
    const response = await client.profiles[':userId'].$patch({
      param: {
        userId
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

  it('patch /profiles/{userId} updates a profile', async () => {
    const response = await client.profiles[':userId'].$patch({
      param: {
        userId
      },
      json: {
        bio: 'Headmaster of Hogwarts School of Witchcraft and Wizardry'
      }
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.bio).toBe(
        'Headmaster of Hogwarts School of Witchcraft and Wizardry'
      );
    }
  });
});
