import Router from 'koa-router';
import { UsersRouter } from './users/users.router';

const AppRouters = new Router();
AppRouters.prefix('/api').use('/users', UsersRouter.routes());

export { AppRouters };
