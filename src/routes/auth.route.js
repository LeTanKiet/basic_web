import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authentication } from '../middlewares/auth.js';
import passport from 'passport';

const authRoutes = () => {
  const router = express.Router();

  router.get('/sign-up', authController.signUpPage);
  router.get('/confirm', authController.confirmEmailPage);
  router.post('/confirm', authController.confirmEmail);
  router.post('/sign-up', authController.signUp);

  router.get('/login', authController.loginPage);
  router.post('/login', authController.login);

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google'), authController.loginWithGoogle);

  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback', passport.authenticate('facebook'), authController.loginWithFacebook);

  router.post('/logout', authController.logout);
  router.get('/me', authentication, authController.getMe);
  router.get('/refresh', authentication, authController.refresh);

  return router;
};

export default authRoutes;
