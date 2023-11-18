import express from 'express';
const app = express();
import { useRoutes } from './routes/index.js';
import useHandlebars from './hooks/useHandlebars.js';
import useEncoded from './hooks/useEncoded.js';

useHandlebars(app);
useEncoded(app);
useRoutes(app);

app.listen(process.env.APP_PORT || 3000);
