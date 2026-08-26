const Task = require("../models/tasksModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const { isValidObjectId } = require("mongoose");

//Tasks

//Get All Tasks from database
const GetAllDBTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
  }
};

//Create new task to the database
const newTask = async (req, res) => {
  try {
    const { task, completed } = req.body;
    //Authorization: Bearer <token>
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const tokenInfos = jwt.verify(token, process.env.JWT_SECRET);
    const email = tokenInfos.data;

    if (!tokenInfos) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const taskOwner = await User.findOne({ email });
    if (!taskOwner) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the task with the same content already exists for the user
    const existingTask = await Task.findOne({ task, taskOwner: taskOwner._id });
    if (existingTask) {
      return res
        .status(400)
        .json({ message: "Task with the same content already exists" });
    }

    // Token is valid
    const newTask = await Task.create({
      task,
      completed,
      taskOwner,
    });

    taskOwner.tasksList.push(newTask);
    await taskOwner.save(); // Wait for the save operation to complete

    res.status(201).json({
      message: "Task created successfully",
      newTask,
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.status(500).json({ error: "Could not create the document" });
  }
};

//Get One Tasks from database
const GetOneDBTask = async (req, res) => {
  const id = req.params.id;
  // Check if the provided ID is a valid ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Not a valid document ID" });
  }

  try {
    //Check if the document exist in database
    const existingTask = await Task.findById(id).populate("taskOwner");
    if (!existingTask) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.status(200).json(existingTask);
  } catch (err) {
    res.status(500).json({ error: "Could not get the document" });
  }
};

//Delete Task from database
const DeleteOneDBTask = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;
  // Check if the provided ID is a valid ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Not a valid document ID" });
  }

  try {
    //Check if the document exist in database
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ error: "Document not found" });
    }

    const deleteTask = await Task.deleteOne({ _id: id });
    const existingUser = await User.findOneAndUpdate(
      { email },
      { $pull: { tasksList: id } }
    );
    res.status(200).json(deleteTask);
  } catch (err) {
    res.status(500).json({ error: "Could not delete the document" });
  }
};

//Update Task from database
const UpdateOneDBTask = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTask = {
      task: req.body.task,
      completed: req.body.completed,
    };
    const newUpdatedTask = await Task.findOneAndUpdate(
      { _id: id },
      updatedTask,
      { new: true }
    );
    console.log(newUpdatedTask);

    res.status(200).json({
      message: "update good",
      newUpdatedTask,
    });
  } catch (err) {
    res.status(500).json({ error: "Could not update the document" });
  }
};

module.exports = {
  GetAllDBTasks,
  newTask,
  GetOneDBTask,
  DeleteOneDBTask,
  UpdateOneDBTask,
};
