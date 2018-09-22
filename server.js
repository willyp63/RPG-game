const Express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = Express();
const port = process.env.PORT || 8080;
const PUBLIC_RESOURCES_PATH = path.resolve(__dirname, 'public');
const CLIENT_APP_PATH = path.resolve(PUBLIC_RESOURCES_PATH, 'index.html');

// use morgan to log requests to the console
app.use(morgan('dev'));

/// Static resources.
app.use('/public', Express.static(PUBLIC_RESOURCES_PATH));

/// Client App.
app.get('/', (_, res) => res.sendFile(CLIENT_APP_PATH));

/// Start-up Script.
(() => {
  app.listen(port, () => {
    console.log(`\n\nServing @ http://localhost:${port}/`)
  });
})();
