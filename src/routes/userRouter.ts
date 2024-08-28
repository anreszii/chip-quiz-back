import { Router } from "express";
import { userController } from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import { upload } from "../config/s3";

const router: Router = Router();

router.get("/:id", authMiddleware, userController.getUser);
router.put("/update/:id", upload, authMiddleware, userController.updateUser);

export default router;
