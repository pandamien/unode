import * as Router from 'koa-router';
import apiMiddleware from '../middlewares/api';
import authMiddleware from  '../middlewares/auth';
import { Context } from 'koa';
import { HTTP_STATUS_CODE } from '../utils/constants';

const router = new Router();
router.use(apiMiddleware, authMiddleware);

router.get('/', (ctx: Context) => {
  ctx.body = { message: 'Hello world' };
});

router.all('*', (ctx: Context) => {
  ctx.throw(HTTP_STATUS_CODE.NOT_FOUND, 'The API you called is not defined.');
});

export default router;
