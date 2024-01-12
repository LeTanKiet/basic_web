import { engine } from 'express-handlebars';

export function useHandlebars(app) {
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      helpers: {
        eq: function (v1, v2) {
          return v1 === v2;
        },
        increment: function (value) {
          return parseInt(value) + 1;
        },
        decrement: function (value) {
          return parseInt(value) - 1;
        },
        isFirstPage: function (value) {
          return value === 1;
        },
        isLastPage: function (value, totalPages) {
          return value === totalPages;
        },
      },
    }),
  );
  app.set('view engine', 'hbs');
  app.set('views', './src/views/app');
}

export function useHandlebarPayment(appPayment) {
  appPayment.engine('hbs', engine({ extname: 'hbs' }));
  appPayment.set('view engine', 'hbs');
  appPayment.set('views', './src/views/payments');
}
