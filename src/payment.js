import 'dotenv/config';
import express from 'express';
import https from 'https';
import fs from 'fs';
import { usePaymentRoutes } from './routes/index.js';
import { useHandlebarPayment } from './hooks/useHandlebars.js';
import useEncoded from './hooks/useEncoded.js';

const app = express();

// SSL certificate
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use(express.static('src/public'));
useHandlebarPayment(app);
useEncoded(app);
usePaymentRoutes(app);

// Create an HTTPS service identical to the HTTP service.
https.createServer(credentials, app).listen(process.env.PAYMENT_PORT || 3001, () => {
  console.log(`Server is running on https://localhost:${process.env.PAYMENT_PORT || 3001}`);
});
