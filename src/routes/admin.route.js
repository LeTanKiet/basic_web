import express from 'express';
import productRoutes from './product.route.js';
import categoryRoutes from './category.route.js';
import AdminController from '../controllers/admin.controller.js';

const AdminRoutes = () => {
  const router = express.Router();

  router.get('/', AdminController.index);
  router.use('/products', productRoutes());
  router.use('/categories', categoryRoutes());

  return router;
};

export default AdminRoutes;
