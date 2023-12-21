import 'dotenv/config';
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import { useRoutes } from './routes/index.js';
import useEncoded from './hooks/useEncoded.js';
import { useHandlebars } from './hooks/useHandlebars.js';
import { BASE_URL } from './utils/constants.js';

app.locals.BASE_URL = BASE_URL;
app.use(cookieParser());
app.use(express.static('src/public'));
useHandlebars(app);
useEncoded(app);
useRoutes(app);

app.listen(process.env.APP_PORT || 3000);
