import { Context } from 'koa';
import { URL } from 'url';
import * as querystring from 'querystring';
import axios from 'axios';
import logger from '../utils/logger';
import { config } from '../config';
import { parseServices } from '../utils/services';
import { url } from '../utils';
import { HTTP_STATUS_CODE } from '../utils/constants';

const oauthConfig = config('oauth');
const redirectUri = url('/oauth/callback');

/**
 * Generates authorization url and redirects user to it.
 *
 * @param {Context} ctx
 */
export async function login(ctx: Context) {
  const authorizeUrl = new URL(url(oauthConfig.authorize_url, true));

  authorizeUrl.searchParams.set('client_id', oauthConfig.client_id);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);

  ctx.response.redirect(authorizeUrl.toString());
}

/**
 * Send Post request to SSO server use given auth code to fetch access token.
 *
 * @param {Context} ctx
 * @param {string} code
 * @returns {Promise<IOptions>}
 */
async function issueToken(ctx: Context, code: string): Promise<IOptions> {
  try {
    const body = querystring.stringify({
      code,
      client_id: oauthConfig.client_id,
      client_secret: oauthConfig.client_id,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await axios.post(url(oauthConfig.token_url, true), body);
    return response.data;
  } catch (e) {
    logger.debug(e.message, e.response.data);
    ctx.throw(HTTP_STATUS_CODE.FORBIDDEN, 'Failed to authorize.');
  }
}

/**
 * Callback when oauth finished.
 *
 * @param {Context} ctx
 */
export async function callback(ctx: Context) {
  logger.debug('Receive oauth callback');
  const code = ctx.query.code;
  const response = await issueToken(ctx, code);
  const token = response.access_token;
  let services: string[] = [];

  try {
    const loginSession = JSON.parse(response.loginSession) as IOptions;
    services = parseServices(loginSession.scopes, true).map(s => s.name);
  } catch (e) {
    ctx.throw('Unable to parse available services in authorization response.');
  }

  const clientID = oauthConfig.client_id;

  if (token && services.find(s => s === clientID || 'HOME' === clientID)) {
    ctx.session.token = token;
    ctx.cookies.set('token', token);

    const redirectUrl = ctx.session.url_before_oauth || url();
    ctx.response.redirect(redirectUrl);
  } else {
    ctx.throw(HTTP_STATUS_CODE.FORBIDDEN);
  }
}
