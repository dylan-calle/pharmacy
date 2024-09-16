import { Router } from "express";
import { metodos as addMermaController } from "../controllers/addMerma.controller.js";

const router = Router();
router.get("/getNumber", addMermaController.getNumber);
router.get("/getMaterial", addMermaController.getMaterial);
router.post("/mermaAndQuantity", addMermaController.mermaAndQuantity);

export default router;
