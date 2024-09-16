// prettier-ignore
import { Router } from "express";
import { metodos as registerRawController } from "../controllers/registerRaw.controller.js";

const router = Router();

router.get("/getRawMaterial", registerRawController.getRawMaterial);
router.post("/addMaterial", registerRawController.addRawMaterial);

router.get("/getGreaterIdRaw", registerRawController.getGreaterIdRaw); // This is to generate el MP-000X on /register-raw
router.post("/existsRawMaterial", registerRawController.existsRawMaterial);
router.get(
  "/getRawMaterialExpectId",
  registerRawController.getRawMaterialExpectId
);
router.post("/updateRawMaterial", registerRawController.updateRawMaterial);
router.post("/deleteRawMaterial", registerRawController.deleteRawMaterial);
router.post(
  "/existsNotSameRawMaterial",
  registerRawController.existsNotSameRawMaterial
);
export default router;
