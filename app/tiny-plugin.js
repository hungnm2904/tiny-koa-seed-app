import { Error } from 'mongoose';
import { REGEX } from './constants/regex.constant';

export const tinyPlugin = schema => {
  schema.add({
    createdAt: Date,
    updatedAt: Date,
  });

  schema.pre('save', preSave);
  schema.pre('update', preUpdate);
  schema.pre('findOneAndUpdate', preUpdate);

  // For custom message unique error
  schema.post('save', postHook);
  schema.post('update', postHook);
  schema.post('findOneAndUpdate', postHook);

  schema.methods.excludes = excludes;
};

function preSave(next) {
  this.createdAt = Date.now();
  this.updatedAt = this.createdAt;
  next();
}

function preUpdate(next) {
  this.updatedAt = Date.now();
  next();
}

function postHook(error, _, next) {
  if (isUniqueError(error)) {
    const path = REGEX.UNIQUE_VALIDATE_PATH_NAME.exec(error.message)[1].split('_')[0];
    const value = REGEX.UNIQUE_VALIDATE_PATH_VAUE.exec(error.message)[1];
    const message = `${path} ${value} is duplicated`;
    const uniqueError = {
      [path]: new Error.ValidatorError({
        type: 'unique',
        value,
        message,
      }),
    };
    const customError = new Error.ValidationError();
    customError.errors = uniqueError;
    customError.message = customError.message.replace('Validation', 'Write');
    customError.name = customError.name.replace('ValidationError', 'WriteError');
    customError.stack = customError.stack.replace('ValidationError', 'WriteError');
    next(customError);
  } else {
    next();
  }
}

function excludes(pathsStr) {
  const doc = Object.assign({}, this.toObject());
  const paths = pathsStr.split(' ');
  paths.forEach(path => delete doc[path]);
  return doc;
}

//
function isUniqueError(error) {
  return error && error.name === 'BulkWriteError' && error.code === 11000;
}
