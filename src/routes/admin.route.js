import express from 'express';
import productRoutes from './product.route.js';
import categoryRoutes from './category.route.js';

const AdminRoutes = () => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('admin_dashboard');
  });
  router.use('/products', productRoutes());
  router.use("/categories", categoryRoutes());

  return router;
};

export default AdminRoutes;