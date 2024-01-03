const express = require("express");
const router = express.Router();

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
      const user = new UserModel(req.body || {});

      // SAVING USER IN DB
      await user.save();

      res.status(201).send(req.body);
    } catch (error) {
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

      const updateField = req.body;

      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id },
        updateField,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .send({ message: "No user found with the given id" });
      }

      res.send(updatedUser);
    } catch (error) {
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
