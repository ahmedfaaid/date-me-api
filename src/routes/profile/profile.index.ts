import { createRouter } from '@/lib/create-app';
import * as handlers from '@/routes/profile/profile.handler';
import * as routes from '@/routes/profile/profile.route';

const router = createRouter().openapi(routes.profile, handlers.profile);

export default router;