const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');

// Configuration
// ================================================================================================
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config(); // eslint-disable-line
}

console.log(process.env.REDIS_URL);

const app = express();
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.disable('x-powered-by');
// Allowing CORS
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.append('Access-Control-Allow-Methods', [
    'GET',
    'OPTIONS',
    'PUT',
    'POST',
    'DELETE',
  ]);
  res.append(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});
app.enable('trust proxy');

// API routes
require('./routes')(app); // eslint-disable-line

module.exports = app;
