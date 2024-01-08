const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

// MODELS
const UserModel = require("../models/user");

// CREATE AND GET USERS ROUTE
router
  .route("/users")
  .get(async (req, res) => {
    try {
      const users = await UserModel.find({});

      res.send(users);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(async (req, res) => {
    try {
      // CHECK IF EMAIL ALREADY EXISTS
      const userDetails = req.body || {};
      const isEmailExists = await UserModel.find({ email: userDetails?.email });

      if (isEmailExists?.length) {
        return res.status(409).send("Email already exists");
      }

      const user = new UserModel(userDetails);

      // SAVING USER IN DB
      await user.save();

      res.status(201).send(user);
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
