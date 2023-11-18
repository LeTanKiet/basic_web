import homeRoutes from '../routes/home.route.js';

export function useRoutes(app) {
  app.use('/', homeRoutes());
}

export function usePaymentRoutes(app) {}
