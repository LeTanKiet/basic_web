import express from 'express';
import useEncoded from './hooks/useEncoded.js';
import { useHandlebars } from './hooks/useHandlebars.js';
import { useRoutes } from './routes/index.js';
const app = express();

const PORT = process.env.APP_PORT || 3000;

app.use(express.static('src/public'));
useHandlebars(app);
useEncoded(app);
useRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
