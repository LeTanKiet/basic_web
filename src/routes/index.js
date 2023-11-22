import paymentController from '../controllers/payment.controller.js';
import homeRoutes from '../routes/home.route.js';
import paymentRoutes from './payment.route.js';

export function useRoutes(app) {
  app.use('/', homeRoutes());
}

export function usePaymentRoutes(app) {
  app.use('/', paymentRoutes());
}
