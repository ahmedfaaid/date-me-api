import createApp from '@/lib/create-app';
import configureOpenApi from './lib/configure-open-api';
import index from '@/routes/index.route';

const app = createApp();

const routes = [
  index
];

configureOpenApi(app);

routes.forEach((route) => {
  app.route('/', route)
});

export default app;
