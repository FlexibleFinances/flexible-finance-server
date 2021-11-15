import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import path from 'path';
import { setAuthRoutes } from './app/routes/auth.routes.js';
import { setUserRoutes } from './app/routes/user.routes.js';
import toobusy from 'toobusy-js';
import url from 'url';

dotenv.config();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const app = express();

app
  .use(express.static(path.join(__dirname, '/public')))
  .use(helmet())
  .use(compression())
  .use(cors())
  .use(express.json({ limit: '1kb' }))
  .use(express.urlencoded({ extended: true, limit: '1kb' }))
  .use(hpp())
  .set('views', __dirname, '/views')
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'));

app.use(function (req, res, next) {
  if (toobusy()) {
    // log if you see necessary
    res.send(503, 'Server Too Busy');
  } else {
    next();
  }
});

setAuthRoutes(app); ;
setUserRoutes(app);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
