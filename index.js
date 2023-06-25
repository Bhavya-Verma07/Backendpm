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
require("dotenv").config();

DB();
// Run the server

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname + "/client/build/index.html"),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  });
}



app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
