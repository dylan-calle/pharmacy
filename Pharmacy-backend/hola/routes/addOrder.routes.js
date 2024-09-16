import { Router } from "express";
import { methods as addOrderController } from "./../controllers/addOrder.controller.js";

const router = Router();

router.get("/getProducts", addOrderController.getProducts);
router.get("/getClients", addOrderController.getClients);
router.get("/getDoctors", addOrderController.getDoctors);
router.get("/getNumber", addOrderController.getNumber);
router.get("/getOrders", addOrderController.getOrders);
router.post("/addOrder", addOrderController.addOrder);
router.post("/addDoctor", addOrderController.addDoctor);
router.post("/addClient", addOrderController.addClient);
router.get("/getPreparedOrders", addOrderController.getPreparedOrders);
router.post("/updateOrder", addOrderController.updateOrder);
router.post("/getOrdersID", addOrderController.getOrdersID);

export default router;
