const express = require("express");
import {
  createUnit,
  deleteUnit,
  getUnit,
  getUnits,
  updateUnit,
} from "@/controller/unitController";

const unitRouter = express.Router();

unitRouter.get("/units", getUnits);
unitRouter.get("/units/:id", getUnit);
unitRouter.post("/units", createUnit);
unitRouter.put("/units/:id", updateUnit);
unitRouter.delete("/units/:id", deleteUnit);

export default unitRouter;
