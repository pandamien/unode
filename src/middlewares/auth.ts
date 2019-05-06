import { Context } from 'koa';
import axios from 'axios';
import { config } from '../config';
import logger from '../utils/logger';
import { url } from '../utils';
import { parseServices } from '../utils/services';
import { HTTP_STATUS_CODE } from '../utils/constants';

// Status for checking token
enum CHECK_STATUS {
  TRUE,
  FALSE,
  SERVER_FAILURE,
}


/**
 * Judge whether current user is authorized.
 *
 * @param {Context} ctx
 * @param {Next} next
 */
export default async function isAuthorized (ctx: Context, next: Next) {
  if (!config('oauth.enabled')) {
    return await next();
  }

  const token = getToken(ctx);

  if (!token) {
    logger.debug('Redirect(unauthorized).');
    ctx.session['url_before_oauth'] = url(ctx.url);

    // Operator will depend on different sense, better to throw exception.
    // return ctx.redirect(`/oauth/login`);
    return ctx.throw(HTTP_STATUS_CODE.UNAUTHORIZED);
  }

  const tokenStatus = await checkToken(config('oauth.client_id'), token);
  switch (tokenStatus) {
    case CHECK_STATUS.TRUE:
      await next();
      break;
    case CHECK_STATUS.FALSE:
      ctx.throw(HTTP_STATUS_CODE.FORBIDDEN, 'You are not authorized to access this service.');
      break;
    case CHECK_STATUS.SERVER_FAILURE:
      ctx.throw(HTTP_STATUS_CODE.UNAUTHORIZED, 'Unable to check user authorization with SSO server.');
  }
}

/**
 * Send request to sso serve to check token.
 *
 * @param {string} clientID
 * @param {string} token
 * @returns {Promise<CHECK_STATUS>}
 */
async function checkToken(clientID: string, token: string): Promise<CHECK_STATUS> {
    logger.debug('Send check request to SSO server');
    try {
      if (clientID === 'HOME') {
        return CHECK_STATUS.TRUE;
      }

      const checkResp = await axios.post(`${url(config('oauth.check_url'), true)}?access_token=${token}`);
      const services = parseServices(checkResp.data.scopes).map(s => s.name);

      return services.includes(clientID) ? CHECK_STATUS.TRUE : CHECK_STATUS.FALSE;
    } catch (e) {
      return CHECK_STATUS.SERVER_FAILURE;
    }
}

/**
 * Try to get token from session, cookies and request header.
 *
 * @param {Context} ctx
 * @returns {string}
 */
function getToken(ctx: Context): string {
  let token = ctx.session.token || ctx.cookies.get('token');

  // Try to parse from request header.
  if (!token) {
    const tokenHeader = ctx.header.authorization as string;
    const regex = /^token\s(\S+)$/;
    if (tokenHeader && regex.test(tokenHeader)) {
      token = tokenHeader.match(regex)[1];
    }
  }
  return token;
}
