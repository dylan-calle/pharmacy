// prettier-ignore
import { Router } from "express";
import { metodos as registerRawController } from "../controllers/createProduct.controller.js";

const router = Router();

router.get("/getProducts", registerRawController.getProducts);
router.post("/addProduct", registerRawController.addProduct);
router.get("/getGreaterIdProduct", registerRawController.getGreaterIdProduct); // This is to generate el P-000X on /createProduct
router.post("/existsProduct", registerRawController.existsProduct);
router.get("/getProductExpectId", registerRawController.getProductExpectId);
router.post("/updateProduct", registerRawController.updateProduct);
router.post("/deleteProduct", registerRawController.deleteProduct);
router.post(
  "/existsNotSameProduct",
  registerRawController.existsNotSameProduct
);
export default router;
