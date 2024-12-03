import { AppOpenApi } from '@/types';
import packageJSON from '../../package.json';

export default function configureOpenApi(app: AppOpenApi) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Date Me API',
      version: packageJSON.version
    }
  })
}