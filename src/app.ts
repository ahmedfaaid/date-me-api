import createApp from '@/lib/create-app';

const app = createApp();

app.get('/error', (c) => {
  c.status(422);
  c.var.logger.info('Some logs here');
  throw new Error("Man something ain't right");
});

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default app;
