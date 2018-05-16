'use strict';

const Constants = require('./constants');
const app = require('./app');

const PORT =
  process.env.NODE_ENV === Constants.environment.production
    ? process.env.PORT
    : process.env.DEV_SERVER_PORT;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
