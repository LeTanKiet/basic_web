import 'dotenv/config';
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import { useRoutes } from './routes/index.js';
import useEncoded from './hooks/useEncoded.js';
import { useHandlebars } from './hooks/useHandlebars.js';
import { BASE_URL } from './utils/constants.js';
import fs from 'fs';
import https from 'https';

app.locals.BASE_URL = BASE_URL;
const APP_PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.static('src/public'));
useHandlebars(app);
useEncoded(app);
useRoutes(app);

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

https.createServer(credentials, app).listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is running on https://localhost:${process.env.APP_PORT || 3000}`);
});
