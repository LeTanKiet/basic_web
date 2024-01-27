import homeRoutes from '../routes/home.route.js';
import authRoutes from './auth.route.js';
import orderRoutes from './order.route.js';
import paymentRoutes from './payment.route.js';
import customerProductRoutes from './customerProduct.route.js';
import searchRoutes from './search.route.js';
import transactionRoutes from './transactionRoutes.js';
import fileRoutes from './file.route.js';
import addBalanceRoutes from './addBalance.route.js';
import adminRoutes from './admin.route.js';

export function useRoutes(app) {
  app.use('/auth', authRoutes());

  // app.use('/admin', adminRoutes());
  app.use('/file', fileRoutes());
  app.use('/products', customerProductRoutes());

  app.use('/results', searchRoutes());

  app.use('/order', orderRoutes());

  app.use('/admin', adminRoutes());

  app.use('/', homeRoutes());
}

export function usePaymentRoutes(app) {
  app.use('/add', addBalanceRoutes());
  app.use('/payment', paymentRoutes());
  app.use('/transactions', transactionRoutes());
}
