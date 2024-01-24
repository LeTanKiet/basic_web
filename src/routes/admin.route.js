import express from 'express';
import productRoutes from './product.route.js';
import categoryRoutes from './category.route.js';
import AdminController from '../controllers/admin.controller.js';
import { authentication } from '../middlewares/auth.js';

const adminRoutes = () => {
  const router = express.Router();

  router.get('/', authentication, AdminController.index);
  router.use('/products', authentication, productRoutes());
  router.use('/categories', authentication, categoryRoutes());

  return router;
};

export default adminRoutes;
