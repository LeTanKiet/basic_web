import express from 'express';
import HomeController from '../controllers/home.controller.js';

const homeRoutes = () => {
  const router = express.Router();

  router.get('/', HomeController.index);

  return router;
};

export default homeRoutes;
