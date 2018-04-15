import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

import { tinyPlugin } from '../../tiny-plugin';
import { MODEL_NAMES } from '../../constants/model-names.constant';
import { REGEX } from '../../constants/regex.constant';

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    validate: {
      validator: email => REGEX.EMAIL.test(email),
      msg: 'Email is invalid',
    },
  },
  password: {
    type: String,
    minlength: [8, 'Password min length is 8'],
    required: [true, 'Password is required'],
  },
  phone: { type: String, minlength: [10, 'Phone min length is 10'] },
  token: String,
});

UserSchema.pre('save', preSave);
UserSchema.plugin(tinyPlugin);
UserSchema.methods.comparePassword = comparePassword;
UserSchema.methods.updateToken = updateToken;

const UsersService = mongoose.model(MODEL_NAMES.USER, UserSchema);

export { UserSchema, UsersService };

//
function preSave(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
}

function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
}

function updateToken() {
  const token = crypto.randomBytes(128).toString('hex');
  return this.update({ token })
    .then(() => {
      this.token = token;
      return this;
    })
    .catch(error => error);
}
