require("dotenv").config();

const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const database = require("./config/database");
const Task = require("./api/v1/models/task.model");
const route = require("./api/v1/routes/index.route");
const { applyDefaults } = require("../begin/models/rooms-chat.model");
database.connect();
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
route(app);
app.listen(port, () => {
  console.log(`App listening on PORT ${port}`);
});

app.use(bodyParser.json());
