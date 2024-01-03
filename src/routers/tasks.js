const express = require("express");
const router = express.Router();

// MODELS
const TaskModel = require("../models/task");

// CREATE AND GET TASKS ROUTE

router
  .route("/tasks")
  .get(async (req, res) => {
    try {
      const tasks = await TaskModel.find({});

      res.send(tasks);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post(async (req, res) => {
    try {
      const task = new TaskModel(req.body || {});

      // SAVING TASK IN DB
      await task.save();

      res.status(201).send(req.body);
    } catch (error) {
      res.status(400).send(error);
    }
  });

// GET,UPDATE,DELETE SINGLE TASK

router
  .route("/tasks/:id")
  .get(async (req, res) => {
    try {
      const _id = req.params.id;

      const taskFoundWithId = await TaskModel.findById(_id);

      if (!taskFoundWithId) {
        return res
          .status(404)
          .send({ message: "No task found with the given id" });
      }

      res.send(taskFoundWithId);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .patch(async (req, res) => {
    const currentKeys = Object.keys(req.body || {});

    const allowedKeys = ["task", "completed"];

    const isValidOperation = currentKeys.every((key) =>
      allowedKeys.includes(key)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid keys" });
    }

    try {
      const _id = req.params.id;

      const updateField = req.body;

      const updatedTask = await TaskModel.findByIdAndUpdate(
        { _id },
        updateField,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedTask) {
        return res
          .status(404)
          .send({ message: "No task found with the given id" });
      }

      res.send(updatedTask);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const _id = req.params.id;

      const deletedTask = await TaskModel.findByIdAndDelete({ _id });

      if (!deletedTask) {
        return res
          .status(404)
          .send({ message: "No task found with the given id" });
      }

      res.send(deletedTask);
    } catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = router;
