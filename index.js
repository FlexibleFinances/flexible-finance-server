const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const path = require('path')
const PORT = process.env.PORT || 5000
const toobusy = require('toobusy-js');

const app = express();

var corsOptions = {
  origin: process.env.REQUEST_ORIGIN || process.env.DEV_REQUEST_ORIGIN
}

const db = require("./database/models");
const Role = db.role;

//db.sequelize.sync();
db.sequelize.sync({force: true}).then(() => {
   console.log('Drop and Resync Database with { force: true }');
   initial();
 });

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

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "admin"
  });
}