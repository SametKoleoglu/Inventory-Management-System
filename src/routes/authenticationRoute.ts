import { signIn } from "@/controller/authenticationController";

const express = require("express");

const authenticationRouter = express.Router();

authenticationRouter.post("/sign-up");
authenticationRouter.post("/sign-in", signIn);

export default authenticationRouter;
