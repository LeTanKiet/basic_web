import express from 'express';
const app = express();
import { usePaymentRoutes } from './routes/index.js';
import { useHandlebarPayment } from './hooks/useHandlebars.js';
import useEncoded from './hooks/useEncoded.js';

app.use(express.static('src/public'));
useHandlebarPayment(app);
useEncoded(app);
usePaymentRoutes(app);

app.listen(process.env.PAYMENT_PORT || 3001);
