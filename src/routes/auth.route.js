import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authentication } from '../middlewares/auth.js';

const authRoutes = () => {
  const router = express.Router();

  router.post('/sign-up', authController.signUp);
  router.post('/login', authController.login);
  router.post('/logout', authController.logout);
  router.get('/me', authentication, authController.getMe);
  router.get('/refresh', authentication, authController.refresh);

  return router;
};

export default authRoutes;
