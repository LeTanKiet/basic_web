import { checkPaymentAccount } from '../middlewares/checkPaymentAccount.js';
import homeRoutes from '../routes/home.route.js';
import addBalanceRoutes from './addBalance.route.js';
import adminRoutes from './admin.route.js';
import authRoutes from './auth.route.js';
import authPaymentRoutes from './authPayment.route.js';
import paymentRoutes from './payment.route.js';
import productRoutes from './product.route.js';
import searchRoutes from './search.route.js';
import authPaymentRoutes from './authPayment.route.js';
import addBalanceRoutes from './addBalance.route.js';
import fileRoutes from './file.route.js';
import { checkPaymentAccount } from '../middlewares/checkPaymentAccount.js';

export function useRoutes(app) {
  app.use('/auth', authRoutes());

  app.use('/admin', adminRoutes());
  app.use('/products', productRoutes());
  app.use('/file', fileRoutes());

  app.use('/results', searchRoutes());

  app.use('/', homeRoutes());
}

export function usePaymentRoutes(app) {
  app.use('/add', checkPaymentAccount, addBalanceRoutes());
  app.use('/payment', checkPaymentAccount, paymentRoutes());

  app.use('/auth', authPaymentRoutes());
}
