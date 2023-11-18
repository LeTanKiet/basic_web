import homeRoutes from '../routes/home.route.js';

export default function useRoutes(app) {
  app.use('/', homeRoutes());
}
