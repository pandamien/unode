import * as Router from 'koa-router';
import * as oauthController from '../controllers/OAuthController';
import { config } from '../config';

const router = new Router();

// OAuth
if (config('oauth.enabled')) {
  router.get('/oauth/login', oauthController.login);
  router.get('/oauth/callback', oauthController.callback);
}

export default router;
