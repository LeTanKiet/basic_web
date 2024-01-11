import express from 'express';
import searchController from '../controllers/search.controller.js';
import { authentication } from '../middlewares/auth.js';

const searchRoutes = () => {
  const router = express.Router();

  router.get('/', authentication, searchController.index);

  return router;
};

export default searchRoutes;
