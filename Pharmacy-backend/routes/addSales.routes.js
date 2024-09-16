import { methods as addSalesController } from "./../controllers/addSales.controller.js";
import { Router } from "express";

const router = Router();
router.post("/addSales", addSalesController.addOrderToSales);
export default router;
