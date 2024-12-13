import { createRouter } from '@/lib/create-app';
import * as handlers from '@/routes/user/user.handler';
import * as routes from '@/routes/user/user.route';

const router = createRouter()
  .openapi(routes.users, handlers.users)
  .openapi(routes.createUser, handlers.createUser)
  .openapi(routes.getOneUser, handlers.getOneUser);

export default router;
