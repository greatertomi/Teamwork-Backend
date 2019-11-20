const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

const admins = require('./routes/admins');
const employees = require('./routes/employees');
const articles = require('./routes/articles');

const app = express();

const port = 5000;
app.use(cors());

/*app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
});*/

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());

app.use('/api/v1/admins', admins);
app.use('/api/v1/employees', employees);
app.use('/api/v1/articles', articles);

app.get('', (req, res) => {
  res.json('Hello from server!');
  // res.status.json({});
});

// eslint-disable-next-line prettier/prettier
app.listen(port, () => console.log(`listening on port ${port}`));
