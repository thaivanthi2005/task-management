const Task = require("./task.route");
module.exports = (app) => {
  app.use("/tasks", Task);
};
