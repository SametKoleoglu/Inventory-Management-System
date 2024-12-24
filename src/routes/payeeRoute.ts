const express = require("express");

import {
  createPayee,
  getPayee,
  getPayees,
  updatePayee,
  deletePayee,
} from "@/controller/payeesController";

const payeeRouter = express.Router();

payeeRouter.get("/payees", getPayees);
payeeRouter.get("/payees/:id", getPayee);
payeeRouter.post("/payees", createPayee);
payeeRouter.put("/payees/:id", updatePayee);
payeeRouter.delete("/payees/:id", deletePayee);

export default payeeRouter;
