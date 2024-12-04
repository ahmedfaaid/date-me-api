import { AppOpenApi } from '@/types';
import packageJSON from '../../package.json';
import { apiReference } from '@scalar/hono-api-reference';

export default function configureOpenApi(app: AppOpenApi) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Date Me API',
      version: packageJSON.version
    }
  });

  app.get('/reference',
    apiReference({
      theme: 'elysiajs',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch'
      },
      spec: {
        url: '/doc'
      }
    })
  );
};
