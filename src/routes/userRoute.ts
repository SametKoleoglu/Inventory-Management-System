const express = require("express");
import {
  createUser,
  deleteUser,
  getAttendants,
  getUser,
  getUsers,
  updateUser,
  updateUserPassword,
} from "@/controller/userController";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.get("/users/attendants", getAttendants);
userRouter.get("/users/:id", getUser);
userRouter.post("/users", createUser);
userRouter.put("/users/:id", updateUser);
userRouter.put("/users/update-password/:id", updateUserPassword);
userRouter.delete("/users/:id", deleteUser);

export default userRouter;
