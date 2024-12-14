import {
  createSupplier,
  getSuppliers,
  getSupplier,
} from "@/controller/supplierController";

const express = require("express");

const supplierRouter = express.Router();

supplierRouter.get("/suppliers", getSuppliers);
supplierRouter.get("/suppliers/:id", getSupplier);
supplierRouter.post("/suppliers", createSupplier);

export default supplierRouter;
