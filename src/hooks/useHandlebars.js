import { engine } from 'express-handlebars';

export function useHandlebars(app) {
  app.engine('hbs', engine({ extname: 'hbs' }));
  app.set('view engine', 'hbs');
  app.set('views', './src/views/app');
}

export function useHandlebarPayment(appPayment) {
  appPayment.engine('hbs', engine({ extname: 'hbs' }));
  appPayment.set('view engine', 'hbs');
  appPayment.set('views', './src/views/payments');
}
