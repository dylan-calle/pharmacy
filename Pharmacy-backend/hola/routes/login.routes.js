import { methods as loginController } from "./../controllers/login.controller.js";
import { Router } from "express";

const router = Router();
router.post("/login", loginController.auth);
router.post("refresh-token", loginController.refreshToken);
router.get("/getRole", loginController.getRole);
router.post("/logout", loginController.logout);
export default router;
