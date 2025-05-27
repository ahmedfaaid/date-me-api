import { createRouter } from '@/lib/create-app';
import * as handlers from '@/routes/story/story.handler';
import * as routes from '@/routes/story/story.route';

const router = createRouter().openapi(routes.userStories, handlers.userStories);

export default router;
