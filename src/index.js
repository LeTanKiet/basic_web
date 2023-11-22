import express from 'express';
const app = express();
import { useRoutes } from './routes/index.js';
import useEncoded from './hooks/useEncoded.js';
import { useHandlebars } from './hooks/useHandlebars.js';

app.use(express.static('src/public'));
useHandlebars(app);
useEncoded(app);
useRoutes(app);

app.listen(process.env.APP_PORT || 3000);
