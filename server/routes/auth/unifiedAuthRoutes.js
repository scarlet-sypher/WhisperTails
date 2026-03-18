import express from "express";
import unifiedAuthController from "../../controllers/auth/unifiedAuthController.js";
import { authenticateJWT } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", unifiedAuthController.login);

router.post("/logout", authenticateJWT, unifiedAuthController.logout);

router.get("/google", unifiedAuthController.googleAuth);
router.get("/google/callback", unifiedAuthController.googleCallback);

export default router;
