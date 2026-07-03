require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const database = require("./config/database");
const Task = require("./api/v1/models/task.model");
database.connect();

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(); // ✅ lấy dữ liệu từ MongoDB
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/tasks/detail/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const task = await Task.findOne({ _id: id });
  console.log(task);
});
app.listen(port, () => {
  console.log(`App listening on PORT ${port}`);
});
