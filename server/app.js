const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const Constants = require('./constants');
const defaultErrorHandler = require('./utils/default-error-handler');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

// Serve static assets
app.use(
  `/${Constants.appName}`,
  express.static(path.resolve(__dirname, '..', 'build'))
);

//Body parsing for POST-ing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use(require('./routes'));

// Non-route handlers
app.use(defaultErrorHandler);

// Always return the main index.html, so react-router render the route in the client
if (process.env.NODE_ENV === Constants.environment.production) {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
}

module.exports = app;
