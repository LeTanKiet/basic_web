import express from 'express';
const app = express();
import { usePaymentRoutes } from './routes/index.js';
import useHandlebars from './hooks/useHandlebars.js';
import useEncoded from './hooks/useEncoded.js';

useHandlebars(app);
useEncoded(app);
usePaymentRoutes(app);

app.listen(process.env.PAYMENT_PORT || 3001);
