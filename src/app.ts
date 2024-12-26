import createApp from '@/lib/create-app';
import index from '@/routes/index.route';
import user from '@/routes/user/user.index';
import configureOpenApi from './lib/configure-open-api';

const app = createApp();

const routes = [index, user];

configureOpenApi(app);

routes.forEach((route) => {
  app.route('/', route);
});

export default app;
