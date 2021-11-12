const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const Sequelize = require('sequelize');

sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DEV_DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: process.env.DATABASE_URL ? true : false,
        rejectUnauthorized: false
      }
    }
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
