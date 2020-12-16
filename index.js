const app = require('express')();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const DB_NAME = process.env.DB_NAME || 'database';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const apiRoutes = require('./routes');

// mongodb://localhost/xyz
mongoose.connect(DB_NAME, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.get('/', (req, res) => {
  res.send('Hi');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
