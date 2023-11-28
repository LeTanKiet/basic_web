import homeRoutes from '../routes/home.route.js';
import authRoutes from './auth.route.js';
import paymentRoutes from './payment.route.js';

export function useRoutes(app) {
  app.use('/auth', authRoutes());

  app.use('/', homeRoutes());
}

export function usePaymentRoutes(app) {
  app.use('/', paymentRoutes());
}
