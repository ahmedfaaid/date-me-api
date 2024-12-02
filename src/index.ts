import app from '@/app';

export default {
  port: Number(process.env.PORT || 5555),
  fetch: app.fetch
};
