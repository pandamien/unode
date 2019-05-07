import * as Router from 'koa-router';

import { ParameterizedContext } from 'koa';
import { IRouterContext } from 'koa-router';
import { HTTP_STATUS_CODE } from '../utils/constants';

const router = new Router();


router.get('/', (ctx: ParameterizedContext<any, IRouterContext>) => {
  ctx.body = { message: 'Hello world' };
});

router.all('*', (ctx: ParameterizedContext<any, IRouterContext>) => {
  ctx.throw(HTTP_STATUS_CODE.NOT_FOUND, 'The API you called is not defined.');
});

export default router;
