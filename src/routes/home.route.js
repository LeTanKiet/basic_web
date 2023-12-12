import express from 'express';
import HomeController from '../controllers/home.controller.js';
import { authentication } from '../middlewares/auth.js';

const homeRoutes = () => {
  const router = express.Router();

  router.get('/', authentication, HomeController.index);

  return router;
};

export default homeRoutes;
