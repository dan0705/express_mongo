const express = require('express')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const apiRoutes = require('./routes');

// mongodb://localhost/xyz
mongoose.connect(`${DB_URL}/${DB_NAME}`, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.get('/', (req, res) => {
  res.send('Hi!');
});

app.use(express.json()) 
app.use(express.urlencoded({
  extended: true,
}))
app.use(cookieParser());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});
