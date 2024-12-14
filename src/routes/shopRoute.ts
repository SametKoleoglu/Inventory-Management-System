const express = require("express");
import {
  createShop,
  getShop,
  getShopAttendants,
  getShops,
} from "@/controller/shopController";

const shopRouter = express.Router();

shopRouter.get("/shops", getShops);
shopRouter.get("/shops/:id", getShop);
shopRouter.get("/shop-attendants/:id", getShopAttendants);
shopRouter.post("/shops", createShop);

export default shopRouter;
