import createApp from '@/lib/create-app';
import configureOpenApi from './lib/configure-open-api';

const app = createApp();

configureOpenApi(app);

export default app;
