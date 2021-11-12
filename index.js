const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express();

// var corsOptions = {
//   origin: "http://localhost:4200"
// };

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
//  .use(cors(corsOptions))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'));

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