const express = require("express");
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "@/controller/productController";

const productRouter = express.Router();

productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProduct);
productRouter.post("/products", createProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
