import express from 'express';
import passport from 'passport';
import routes from '../routes';
import { home, search } from '../controllers/videoController';
import {
  getLogin,
  postLogin,
  logout,
  getJoin,
  postJoin,
  githubLogin,
  postGithubLogIn,
  getMe,
  facebookLogin,
  postFacebookLogIn,
} from '../controllers/userController';
import { onlyPublic, onlyPrivate } from '../middlewares';

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

// Gihub
globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate('github', { failureRedirect: '/login' }),
  postGithubLogIn
);

// Facebook
globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(
  routes.facebookCallback,
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  postFacebookLogIn
);

globalRouter.get(routes.me, getMe);

export default globalRouter;
