const Task = require("./task.route");
const User = require("./user.route");
const authMiddlware = require("../middleware/auth.middleware");

module.exports = (app) => {
  app.use("/api/v1/tasks", authMiddlware.requireAuth, Task);
  app.use("/api/v1/users", User);
};
