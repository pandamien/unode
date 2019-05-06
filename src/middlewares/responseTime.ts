import { Context } from 'koa';
import logger from '../utils/logger';

/**
 * Log the response time for each request.
 *
 * @param {Context} ctx
 * @param {Next} next
 */
export default async function responseTime(ctx: Context, next: Next) {
    const start = Date.now();
    const requestInfo = `[${ctx.method}] ${ctx.url}`;
    logger.debug(`${requestInfo} - Request received`);
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    logger.info(`${requestInfo} - Request responded - ${ms}ms`);
}
