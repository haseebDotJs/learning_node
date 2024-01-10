const express = require("express");
const router = express.Router();

// MIDDLEWARES
const auth = require("../middlewares/auth");

// MODELS
const UserModel = require("../models/user");

// LOGIN / LOGOUT USER
router.post("/users/login", async (req, res) => {
  try {
    const user = await UserModel.findCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens?.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    res.status(200).send("User logged out successfully");
  } catch (e) {
    res.status(403).send("Unable to logout");
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.status(200).send("All users logged out successfully");
  } catch (e) {
    res.status(403).send("Unable to logout");
  }
});

// CREATE AND GET USERS ROUTE
router.get("/users/me", auth, (req, res) => {
  res.status(200).send(req.user);
});

router.route("/users").post(async (req, res) => {
  try {
    const userDetails = req.body || {};

    const user = new UserModel(userDetails);

    const token = await user.generateAuthToken();

    // SAVING USER IN DB
    await user.save();

    res.status(201).send({ user, token });
  } catch (error) {
    console.log("___ERR", error);
    res.status(400).send(error);
  }
});

// GET,UPDATE,DELETE SINGLE USER

router
  .route("/users/:id")
  .get(async (req, res) => {
    try {
      const _id = req.params.id;

      const userFoundWithId = await UserModel.findById(_id);

      if (!userFoundWithId) {
        return res
          .status(404)
          .send({ message: "No user found with the given id" });
      }

      res.send(userFoundWithId);
    } catch (error) {
      console.log("___error", error);
      res.status(400).send(error);
    }
  })
  .patch(async (req, res) => {
    const currentKeys = Object.keys(req.body || {});

    const allowedKeys = ["name", "age", "password", "email"];

    const isValidOperation = currentKeys.every((key) =>
      allowedKeys.includes(key)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid keys" });
    }

    try {
      const _id = req.params.id;
      const user = await UserModel.findById(_id);

      currentKeys.forEach(
        (updatedKey) => (user[updatedKey] = req.body[updatedKey])
      );

      await user.save();

      if (!user) {
        return res
          .status(404)
          .send({ message: "No user found with the given id" });
      }

      res.send(user);
    } catch (error) {
      console.log("__err", error);
      res.status(400).send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const _id = req.params.id;

      const deletedUser = await UserModel.findByIdAndDelete({ _id });

      if (!deletedUser) {
        return res
          .status(404)
          .send({ message: "No user found with the given id" });
      }

      res.send(deletedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = router;
