// server.js
const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const DB = require("./connectDB/dbconnection");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use(require("./routes/user"));
const passport = require("passport");
const path = require("path");
require("./config/passport")(passport);

DB();
// Run the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
