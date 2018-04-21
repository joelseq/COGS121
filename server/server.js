const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const historyApiFallback = require('connect-history-api-fallback');
const logger = require('morgan');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.config');

// Configuration
// ================================================================================================
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config(); // eslint-disable-line
}

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

if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(
    historyApiFallback({
      verbose: false,
    }),
  );

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      contentBase: path.resolve(__dirname, '../client/public'),
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false,
      },
    }),
  );

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
}

module.exports = app;
