const app = require("express")();
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const DB_NAME = process.env.DB_NAME || "database";
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// mongodb://localhost/xyz
mongoose.connect(DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Serving on ${PORT}`);
});

const { auth } = require("./middleware/auth");

const {
  RegisterUser,
  LoginUser,
  LogoutUser,
  getUserDetails,
} = require("./controller/AuthController");

app.post("/api/users/register", RegisterUser);
app.post("/api/users/login", LoginUser);
app.get("/api/users/auth", auth, getUserDetails);
app.get("/api/users/logout", auth, LogoutUser);
