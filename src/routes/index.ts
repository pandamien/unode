import * as Router from 'koa-router';
import web from './web';
import api from './api';

const R = new Router();

// Web
R.use(web.routes());

// API
R.use('/api', api.routes());

export default R;
