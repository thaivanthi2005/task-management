require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const database = require("./config/database");
const Task = require("./api/v1/models/task.model");
const route = require("./api/v1/routes/index.route");
const { applyDefaults } = require("../begin/models/rooms-chat.model");
database.connect();

route(app);
app.listen(port, () => {
  console.log(`App listening on PORT ${port}`);
});
