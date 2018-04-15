import httpError from 'http-errors';
import { STATUS_CODES } from './constants/status-codes.constant';

export function handleResponse() {
  return (ctx, next) => {
    ctx.response.ok = handleSuccess.bind(ctx, STATUS_CODES.OK);
    ctx.response.created = handleSuccess.bind(ctx, STATUS_CODES.CREATED);
    ctx.response.noContent = handleSuccess.bind(ctx, STATUS_CODES.NO_CONTENT, null);
    ctx.response.error = handleError.bind(ctx);
    ctx.response.badRequest = handleErrorMessage.bind(ctx, STATUS_CODES.BAD_REQUEST);
    return next();
  };
}

function handleSuccess(status, data = null) {
  this.body = data;
  this.status = status;
}

function handleError(error) {
  global.logger.warn(error.toString());
  const normalizedError = normalizeHttpError(error);
  this.status = normalizedError.status;
  this.body = normalizedError.message;
}

function handleErrorMessage(status, message) {
  global.logger.warn(message);
  this.status = status;
  this.body = message;
}

function normalizeHttpError(error) {
  if (error.name === 'ValidationError') {
    return httpError(STATUS_CODES.BAD_REQUEST, extractMongooseErrorMessage(error));
  }
  if (error.name === 'WriteError' || error.name === '') {
    return httpError(STATUS_CODES.UNPROCESSABLE_ENTITY, extractMongooseErrorMessage(error));
  }
  return error;
}

function extractMongooseErrorMessage(error) {
  return Object.values(error.errors)[0].message;
}
