// MODELS
const UserModel = require("../models/user");

const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new Error("");
    }

    const user = await UserModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("");
    }

    req.token = token;
    req.user = user;

    next();
  } catch (_) {
    console.log("__ERR", _);
    res.status(401).send({ error: "Please authenticate!" });
  }
};

module.exports = auth;
