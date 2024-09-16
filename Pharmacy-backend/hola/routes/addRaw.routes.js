import { Router } from "express";
import { metodos as addRawController } from "../controllers/addRaw.controller.js";

const router = Router();

router.get("/getMaterial", addRawController.getMaterial);
router.get("/getNumber", addRawController.getNumber);
router.post("/addRawAndQuantity", addRawController.addRawAndQuantity);

export default router;
