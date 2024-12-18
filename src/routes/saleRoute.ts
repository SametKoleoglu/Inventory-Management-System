const express = require("express");
import { createSale, createSaleItem, getSale, getSales } from "@/controller/salesController";

const saleRouter = express.Router();

saleRouter.get("/sales", getSales);
saleRouter.get("/sales/:id", getSale);
saleRouter.post("/sales", createSale);
saleRouter.post("/sales/item", createSaleItem);
// saleRouter.put("/sales/:id", updatesale);
// saleRouter.delete("/sales/:id", deletesale);

export default saleRouter;
