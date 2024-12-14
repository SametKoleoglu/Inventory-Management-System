const express = require("express");

import { getCustomers, getCustomerById, createCustomer } from "@/controller/customerController";

const customerRouter = express.Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomerById);
customerRouter.post("/customers", createCustomer);

export default customerRouter;
