const express = require("express");
import {
  createSale,
  createSaleItem,
  getSale,
  getSales,
  getShopSales,
  getShopsSales,
} from "@/controller/salesController";

const saleRouter = express.Router();

// Daha spesifik olanları önce tanımlayın
saleRouter.get("/sales/all-shops", getShopsSales);
saleRouter.get("/sales/all-shops/:id", getShopSales);

// Dinamik route'ları sona koyun
saleRouter.get("/sales/:id([0-9a-fA-F]{24})", getSale);
saleRouter.get("/sales", getSales);
saleRouter.post("/sales", createSale);
saleRouter.post("/sales/item", createSaleItem);
export default saleRouter;
