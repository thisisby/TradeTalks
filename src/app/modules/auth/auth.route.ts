import {Router} from "express";

import AuthController from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/logout", AuthController.logout)
router.get("/refresh", AuthController.refreshToken)
router.post("/send-code", AuthController.sendCode);
router.post("/check-code", AuthController.checkCode);

export default router;
