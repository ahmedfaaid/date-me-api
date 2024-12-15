import createApp from '@/lib/create-app';
import router from '@/routes/user/user.index';
import { describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';

const client = testClient(createApp().route('/', router));

describe('Users list', () => {
  it('responds with an array of users', async () => {
    const response = await client.users.$get();
    const json = await response.json();
    expect(json).toBeArray();
  });
});
