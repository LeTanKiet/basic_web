import homeRoutes from '../routes/home.route.js';
import addBalanceRoutes from './addBalance.route.js';
import adminRoutes from './admin.route.js';
import authRoutes from './auth.route.js';
import orderRoutes from './order.route.js';
import paymentRoutes from './payment.route.js';
import searchRoutes from './search.route.js';
import transactionRoutes from './transactionRoutes.js';

export function useRoutes(app) {
  app.use('/auth', authRoutes());

  app.use('/admin', adminRoutes());

  app.use('/results', searchRoutes());

  app.use('/order', orderRoutes());

  app.use('/', homeRoutes());
}

export function usePaymentRoutes(app) {
  app.use('/add', addBalanceRoutes());
  app.use('/payment', paymentRoutes());
  app.use('/transactions', transactionRoutes());
}
