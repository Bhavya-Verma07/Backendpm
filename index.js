// server.js

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
const cors = require("cors");

const DB = require("./connectDB/dbconnection");

app.use(cors());


app.use(require("./routes/user"));
// app.use(require("./routes/pokemon"));


DB();
// Run the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
