const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const setupRoutes = require("./Routes/index");
const socketService = require("./Config/Sockets/sockets");

const port = process.env.PORT || 8080;

let app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
const server = require("http").Server(app);
socketService(server);
setupRoutes(app);

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log("Error occured while connecting", error);
  });

server.listen(port, () => {
  console.log("Server running on port no :- ", port);
});
