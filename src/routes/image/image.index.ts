import { createRouter } from '@/lib/create-app';
import * as handlers from '@/routes/image/image.handler';
import * as routes from '@/routes/image/image.route';

const router = createRouter()
  .openapi(routes.addProfilePicture, handlers.addProfilePicture)
  .openapi(routes.deleteProfilePicture, handlers.deleteProfilePicture);

export default router;
