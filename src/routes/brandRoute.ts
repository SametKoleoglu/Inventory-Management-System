const express = require("express");

import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "@/controller/brandController";

const brandRouter = express.Router();

brandRouter.get("/brands", getBrands);
brandRouter.get("/brands/:id", getBrand);
brandRouter.post("/brands", createBrand);
brandRouter.put("/brands/:id", updateBrand);
brandRouter.delete("/brands/:id", deleteBrand);

export default brandRouter;
