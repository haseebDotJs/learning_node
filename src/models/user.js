const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
    validator(value) {
      if (value < 0) {
        throw new Error("Provide valid age");
      }
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Should be a valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value?.includes("password")) {
        throw new Error("Password can not contain password");
      }
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
