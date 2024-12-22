import {
  changePassword,
  forgotPassword,
  signIn,
  verifyToken,
} from "@/controller/authenticationController";

const express = require("express");

const authenticationRouter = express.Router();

authenticationRouter.post("/sign-up");
authenticationRouter.post("/sign-in", signIn);
authenticationRouter.put("/forgot-password", forgotPassword);
authenticationRouter.get("/verify-token", verifyToken);
authenticationRouter.put("/change-password", changePassword);

export default authenticationRouter;
