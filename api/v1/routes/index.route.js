const Task = require("./task.route");
const User = require("./user.route");
module.exports = (app) => {
  app.use("/api/v1/tasks", Task);
  app.use("/api/v1/users", User);
};
