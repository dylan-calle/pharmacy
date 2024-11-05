import { Router } from "express";
import { metodos as addPrescriptionController } from "../controllers/addPrescription.controller.js";

const router = Router();
router.get("/getProducts", addPrescriptionController.getProducts);
router.get("/getMaterial", addPrescriptionController.getMaterial);
router.get("/getNumber", addPrescriptionController.getNumber);
router.post("/insertPrescription", addPrescriptionController.insertPrescription);
router.get("/getPrescriptions", addPrescriptionController.getPrescriptions);
router.post("/getRawsIdGiven", addPrescriptionController.getRawsIdGiven);
export default router;
