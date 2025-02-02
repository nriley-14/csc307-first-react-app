import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/users", (req, res) => {
  userService.getUsers().then((users) => {
    const name = req.query.name;
    const job = req.query.job;

    if (name != undefined) {
      userService.findUserByName(name).then((user) => {
        if (!user) {
          return res.status(404).send("Resource not found.");
        }
        res.send(user);
      });
    } else if (job != undefined) {
      userService.findUserByJob(job).then((user) => {
        if (!user) {
          return res.status(404).send("Resource not found.");
        }
        res.send(user);
      });
    } else {
      res.send(users);
    }
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService.findUserById(id).then((user) => {
    if (!user) {
      return res.status(404).send("Resource not found.");
    }
    res.send(user);
  });
});

app.get("/users/:name/:job", (req, res) => {
  const name = req.params["name"];
  const job = req.params["job"];
  let result = userService.findUsersbyNameAndJob(name, job);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = userService.findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    users.users_list = users.users_list.filter((user) => user.id !== id);
    res.status(204).send("Delete successful.");
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd);
  res.status(201).json({
    message: "Content Created Successfully",
    createdUser: userToAdd,
  });
});
