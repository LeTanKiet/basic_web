import { engine } from 'express-handlebars';

export default function useHandlebars(app) {
  app.engine('hbs', engine({ extname: 'hbs' }));
  app.set('view engine', 'hbs');
  app.set('views', './src/views');
}
