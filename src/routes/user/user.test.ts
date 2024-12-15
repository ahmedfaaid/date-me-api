import { createTestApp } from '@/lib/create-app';
import router from '@/routes/user/user.index';
import { describe, expect, it } from 'bun:test';

describe('Users list', () => {
  it('responds with an array of users', async () => {
    const testRouter = createTestApp(router);
    const response = await testRouter.request('/users');
    const result = await response.json();
    expect(result).toBeArray();
  });
});
