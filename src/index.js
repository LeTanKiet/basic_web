import 'dotenv/config';
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import { useRoutes } from './routes/index.js';
import useEncoded from './hooks/useEncoded.js';
import { useHandlebars } from './hooks/useHandlebars.js';
import { BASE_APP_URL } from './utils/constants.js';
import usePassportAuth from './hooks/usePassportAuth.js';

app.locals.BASE_URL = BASE_APP_URL;
const APP_PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.static('src/public'));
useHandlebars(app);
useEncoded(app);
usePassportAuth(app);
useRoutes(app);

app.listen(APP_PORT, () => {
  console.log(`Server is running on http://localhost:${APP_PORT}`);
});
