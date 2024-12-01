import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default {
  port: 5555,
  fetch: app.fetch
};
