import createApp from '@/lib/create-app';
import auth from '@/routes/auth/auth.index';
import index from '@/routes/index.route';
import user from '@/routes/user/user.index';
import configureOpenApi from './lib/configure-open-api';

const app = createApp();

const routes = [index, user, auth];

configureOpenApi(app);

routes.forEach((route) => {
  app.route('/', route);
});

export default app;
