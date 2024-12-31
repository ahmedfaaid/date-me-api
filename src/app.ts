import createApp from '@/lib/create-app';
import auth from '@/routes/auth/auth.index';
import index from '@/routes/index.route';
import profile from '@/routes/profile/profile.index';
import user from '@/routes/user/user.index';
import configureOpenApi from './lib/configure-open-api';

const app = createApp();

const routes = [index, user, auth, profile];

configureOpenApi(app);

routes.forEach((route) => {
  app.route('/', route);
});

export default app;
