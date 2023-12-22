import 'dotenv/config';
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import { useRoutes } from './routes/index.js';
import useEncoded from './hooks/useEncoded.js';
import { useHandlebars } from './hooks/useHandlebars.js';
import { useRoutes } from './routes/index.js';

const PORT = process.env.APP_PORT || 3000;

app.use(cookieParser());
app.use(express.static('src/public'));
useHandlebars(app);
useEncoded(app);
useRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
