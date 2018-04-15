import passport from 'koa-passport';
import BearerStrategy from 'passport-http-bearer';
import { UsersService } from './api/users/users.service';

export const authenticate = {
  isLogin: isLogin(),
};

passport.use(new BearerStrategy((token, done) => {
  UsersService.findOne({ token }, (error, user) => {
    if (error) return done(error);
    if (!user) return done(null, false);
    return done(null, user);
  });
}));

function isLogin() {
  return passport.authenticate('bearer', { session: false });
}
