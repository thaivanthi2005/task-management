const mongoose = require("mongoose");
const generate = require("../../../helper/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", accountSchema, "users");
module.exports = User;
