import exp from "express";
import { TaskModel } from "../models/taskModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const taskApp = exp();

//Create a task (ADMIN assigns to any user, USER auto-assigns to self)
taskApp.post("/tasks", verifyToken("ADMIN", "USER"), async (req, res, next) => {
  try {
    const newTask = { ...req.body };
    console.log(newTask);

    //if USER, force assignee to be themselves
    if (req.user.role === "USER") {
      newTask.assignee = req.user.id;
    }

    //create new task document
    const newTaskDoc = new TaskModel(newTask);
    //save document
    await newTaskDoc.save();
    //send res
    res.status(201).json({ message: "Task created", payload: newTaskDoc });
  } catch (err) {
    next(err);
  }
});

//Get all tasks (ADMIN gets all, USER gets only their assigned tasks)
taskApp.get(
  "/tasks",
  verifyToken("ADMIN", "USER"),
  async (req, res, next) => {
    try {
      let tasks;
      if (req.user.role === "ADMIN") {
        //admin gets all tasks with assignee details
        tasks = await TaskModel.find().populate(
          "assignee",
          "firstName lastName email"
        );
      } else {
        //user gets only their assigned tasks
        tasks = await TaskModel.find({ assignee: req.user.id }).populate(
          "assignee",
          "firstName lastName email"
        );
      }
      res.status(200).json({ message: "Tasks fetched", payload: tasks });
    } catch (err) {
      next(err);
    }
  }
);

//Get single task by id
taskApp.get(
  "/tasks/:taskId",
  verifyToken("ADMIN", "USER"),
  async (req, res, next) => {
    try {
      const task = await TaskModel.findById(req.params.taskId).populate(
        "assignee",
        "firstName lastName email"
      );
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      //user can only view their own task
      if (
        req.user.role === "USER" &&
        task.assignee._id.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: "You are not authorized" });
      }
      res.status(200).json({ message: "Task fetched", payload: task });
    } catch (err) {
      next(err);
    }
  }
);

//Update task (ADMIN can update everything, USER can only update status)
taskApp.put(
  "/tasks/:taskId",
  verifyToken("ADMIN", "USER"),
  async (req, res, next) => {
    try {
      const task = await TaskModel.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (req.user.role === "USER") {
        //user can only update status of their own task
        if (task.assignee.toString() !== req.user.id) {
          return res.status(403).json({ message: "You are not authorized" });
        }
        //user can only update status field
        if (req.body.status) {
          task.status = req.body.status;
        } else {
          return res
            .status(400)
            .json({ message: "Users can only update task status" });
        }
      } else {
        //admin can update all fields
        Object.assign(task, req.body);
      }

      await task.save();
      const updatedTask = await TaskModel.findById(task._id).populate(
        "assignee",
        "firstName lastName email"
      );
      res
        .status(200)
        .json({ message: "Task updated", payload: updatedTask });
    } catch (err) {
      next(err);
    }
  }
);

//Delete task (ADMIN can delete any, USER can delete their own)
taskApp.delete(
  "/tasks/:taskId",
  verifyToken("ADMIN", "USER"),
  async (req, res, next) => {
    try {
      const task = await TaskModel.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      //user can only delete their own tasks
      if (
        req.user.role === "USER" &&
        task.assignee.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: "You are not authorized" });
      }
      await TaskModel.findByIdAndDelete(req.params.taskId);
      res.status(200).json({ message: "Task deleted" });
    } catch (err) {
      next(err);
    }
  }
);