import paymentController from '../controllers/payment.controller.js';
import homeRoutes from '../routes/home.route.js';
import paymentRoutes from './payment.route.js';
import productRoutes from './product.route.js';

export function useRoutes(app) {
  app.use('/product', productRoutes());

  app.use('/', homeRoutes());
}

export function usePaymentRoutes(app) {
  app.use('/', paymentRoutes());
}
