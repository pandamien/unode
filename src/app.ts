import * as koa from 'koa';
import * as session from 'koa-session';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';

import { config } from './config';
import logger from './utils/logger';
import router from './routes';
import serveStaticFiles from './middlewares/staticFiles';
import errorHandler from './middlewares/errorHandler';
import responseTime from './middlewares/responseTime';

export default function assemblyApp() {
  const app = new koa();

  // session key.
  app.keys = [config('APP_KEY')];

  // middlewares
  app.use(errorHandler)
    .use(responseTime)
    .use(session(app))
    .use(compress())
    .use(serveStaticFiles())
    .use(bodyParser());

  // Routing
  app.use(router.routes())
    .use(router.allowedMethods());

  // On error.
  app.on('error', (err) => {
    logger.error(err.stack);
  });

  return app;
}
