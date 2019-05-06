import { Context } from 'koa';
import logger from '../utils/logger';
import { url } from '../utils';
import { HTTP_STATUS_CODE } from '../utils/constants';

/**
 * Handle uncaught errors.
 *
 * @param {Context} ctx
 * @param {Next} next
 */
export default async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    logger.error(`Error happens when request: [${ctx.method}] ${ctx.url}`, {
      error: error.message,
      stack: error.stack,
    });

    switch (error.status) {
        case HTTP_STATUS_CODE.UNAUTHORIZED:
          return ctx.redirect(url('/oauth/login'));
        case HTTP_STATUS_CODE.FORBIDDEN:
          return ctx.redirect(`/unauthorized`);
        case HTTP_STATUS_CODE.NOT_FOUND:
          return ctx.redirect(url());
        default:
          ctx.status = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    }
  }
}
