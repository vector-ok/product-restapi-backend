const express = require('express');

const app = express();

// const multer = require('multer');
const path = require('path');

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRoute = require('./routes/userRoutes');
const orderRoute = require('./routes/orderRoutes');

// const { pool } = require('./services/db');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/tmp/foo.jpg', express.static(path.join(__dirname, '/tmp/foo.jpg')));

// routes
app.use('/auth', userRoute);
app.use('/orders', orderRoute);
app.use('/', (req, res, next) => {
  res.json({
    message: 'App served successfully. This is the default response! Check your endpoint if you did not expect this'
  });
  next();
});

module.exports = app;
