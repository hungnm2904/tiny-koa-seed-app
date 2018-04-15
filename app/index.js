import Koa from 'koa';
import koaBody from 'koa-body';
import koaMorgan from 'koa-morgan';
import passport from 'koa-passport';

import './logger';
import './db';
import { handleResponse } from './handle-response';
import { AppRouters } from './api';

const app = new Koa();
app
  .use(koaBody())
  .use(koaMorgan('combined'))
  .use(passport.initialize())
  .use(handleResponse())
  .use(AppRouters.routes());

export default app;
