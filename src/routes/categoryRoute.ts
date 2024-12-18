const express = require("express");

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "@/controller/categoryController";

const categoryRouter = express.Router();

categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:id", getCategory);
categoryRouter.post("/categories", createCategory);
categoryRouter.put("/categories/:id", updateCategory);
categoryRouter.delete("/categories/:id", deleteCategory);

export default categoryRouter;
