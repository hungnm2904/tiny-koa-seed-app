import Router from 'koa-router';

import { UsersController } from './users.controller';
import { REGEX } from '../../constants/regex.constant';
import { authenticate } from '../../authenticate';

const UsersRouter = new Router();
UsersRouter.get('/me', authenticate.isLogin, UsersController.me)
  .post('/login', validateLoginParams, UsersController.login)
  .post('/logout', authenticate.isLogin, UsersController.logout)
  .post('/', UsersController.create)
  .put('/me', authenticate.isLogin, UsersController.updateMe);

export { UsersRouter };

//
function validateLoginParams({ request, response }, next) {
  if (!request.body.email) return response.badRequest('Email is required');
  if (!request.body.password) return response.badRequest('Password is required');
  if (!REGEX.EMAIL.test(request.body.email)) return response.badRequest('Email is invalid');
  return next();
}
