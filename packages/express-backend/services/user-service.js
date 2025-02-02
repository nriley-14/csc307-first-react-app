import mongoose from "mongoose";
import userModel from "../models/user.js";
import dotenv from "dotenv";

mongoose.set("debug", true);

dotenv.config();
const { MONGO_CONNECTION_STRING } = process.env;
console.log(MONGO_CONNECTION_STRING);

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function deleteUser(id) {
  const promise = userModel.findByIdAndDelete(id);
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  deleteUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
};
