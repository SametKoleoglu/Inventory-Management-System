const express = require("express");

import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
} from "@/controller/expensesController";

const expenseRouter = express.Router();

expenseRouter.get("/expenses", getExpenses);
expenseRouter.get("/expenses/:id", getExpense);
expenseRouter.post("/expenses", createExpense);
expenseRouter.put("/expenses/:id", updateExpense);
expenseRouter.delete("/expenses/:id", deleteExpense);

export default expenseRouter;
