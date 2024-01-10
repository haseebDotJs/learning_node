const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.statics.findCredentials = async function (email, password) {
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(400).send({ error: "User not found" });
  }

  return user;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userProfile = user.toObject();

  delete userProfile.password;
  delete userProfile.tokens;

  return userProfile;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  console.log("pre saving user");

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
