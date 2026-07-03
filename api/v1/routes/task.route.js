const express = require("express");
const router = express.Router();
const controller = require("../controllers/task.controller");
router.get("/", controller.index);
router.get("/detail", controller.detail);
module.exports = router;
