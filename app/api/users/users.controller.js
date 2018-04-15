import httpError from 'http-errors';

import { UsersService } from './users.service';
import { STATUS_CODES } from '../../constants/status-codes.constant';

export const UsersController = {
  me,
  login,
  logout,
  create,
  updateMe,
};

function me({ response, state }) {
  return response.ok(state.user.excludes('password'));
}

function login({ request, response }) {
  return UsersService.findOne({ email: request.body.email })
    .then(checkEmail)
    .then(checkPassword.bind(null, request.body.password))
    .then(updateToken)
    .then(user => response.ok(user.excludes('password')))
    .catch(response.error);
}

function logout({ response, state }) {
  return UsersService.findByIdAndUpdate(state.user.id, { token: null })
    .then(response.noContent)
    .catch(response.error);
}

function create({ request, response }) {
  return UsersService.create(request.body)
    .then(user => response.created(user.excludes('password')))
    .catch(response.error);
}

function updateMe({ request, response, state }) {
  delete request.body.email;
  delete request.body.password;
  delete request.body.token;

  return UsersService.findByIdAndUpdate(state.user.id, request.body, {
    runValidators: true,
    new: true,
  })
    .then(user => response.ok(user.excludes('password')))
    .catch(response.error);
}

//
function checkEmail(user) {
  if (!user) throw httpError(STATUS_CODES.UNAUTHORIZED, 'Email is incorrect');
  return user;
}

function checkPassword(password, user) {
  if (!user.comparePassword(password)) {
    throw httpError(STATUS_CODES.UNAUTHORIZED, 'Password is incorrect');
  }
  return user;
}

function updateToken(user) {
  return user.updateToken();
}
