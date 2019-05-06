import { Context } from 'koa';
import logger from '../utils/logger';
import { HTTP_STATUS_CODE } from '../utils/constants';

/**
 * API middleware.
 * This middleware is used to set response header to json and normalize errors.
 *
 * @param {Context} ctx
 * @param {Next} next
 */
export default async function (ctx: Context, next: Next) {
  try {
    await next();
    ctx.response.set('Content-type', 'application/json');
  } catch (error) {
    logger.error(`Error happens when request: [${ctx.method}] ${ctx.url}`, {
      error: error.message,
      stack: error.stack,
    });

    ctx.body = {
      error: error.message,
    };
    ctx.status = error.status || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  }
}
