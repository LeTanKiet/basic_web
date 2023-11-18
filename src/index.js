import express from 'express';
const app = express();
import { engine } from 'express-handlebars';
import useRoutes from './routes/index.js';

app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

useRoutes(app);

app.listen(3000);
