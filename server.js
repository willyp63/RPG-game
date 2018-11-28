const Express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = Express();
const port = process.env.PORT || 8080;
const PUBLIC_RESOURCES_PATH = path.resolve(__dirname, 'public');
const CLIENT_APP_PATH = path.resolve(PUBLIC_RESOURCES_PATH, 'index.html');

app.use(morgan('dev'));
app.use('/public', Express.static(PUBLIC_RESOURCES_PATH));
app.get('/', (_, res) => res.sendFile(CLIENT_APP_PATH));

app.listen(port, () => {
  console.log(`\n\nServing @ http://localhost:${port}/`)
});
