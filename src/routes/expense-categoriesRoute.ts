const express = require("express");

import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategories,
  getExpenseCategory,
  updateExpenseCategory,
} from "@/controller/expense-categoriesController";

const expenseCategoriesRouter = express.Router();

expenseCategoriesRouter.get("/expense-categories", getExpenseCategories);
expenseCategoriesRouter.get("/expense-categories/:id", getExpenseCategory);
expenseCategoriesRouter.post("/expense-categories", createExpenseCategory);
expenseCategoriesRouter.put("/expense-categories/:id", updateExpenseCategory);
expenseCategoriesRouter.delete("/expense-categories/:id", deleteExpenseCategory);

export default expenseCategoriesRouter;
