const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const path = require('path')
const PORT = process.env.PORT || 5000
const toobusy = require('toobusy-js');
const Umzug = require('umzug');
const fs = require('fs');

const app = express();

const db = require("./database/models");

const umzug = new Umzug({
  migrations: {path: __dirname + '/database/migrations/'},
  logger: console,
}); 

(async () => {
  if (process.env.ALLOW_DB_TEARDOWN === 'true' && !fs.existsSync('./.preserve_db')) {
    await umzug.down();
  }
})();

(async () => {
  await umzug.up();
  fs.writeFile('.preserve_db', '', () => {});
})();

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(helmet())
  .use(compression())
  .use(cors())
  .use(express.json({ limit: "1kb" }))
  .use(express.urlencoded({ extended: true, limit: "1kb"  }))
  .use(hpp())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'));

app.use(function(req, res, next) {
  if (toobusy()) {
      // log if you see necessary
      res.send(503, "Server Too Busy");
  } else {
  next();
  }
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
