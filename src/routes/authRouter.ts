import { body, check } from "express-validator";
import { authController } from "../controllers/authController";
import { Router } from "express";
import { upload } from "../config/s3";
import recoveryMiddleware from "../middleware/recoveryMiddleware";

const router: Router = Router();

router.post(
  "/login",
  [check("username", "Имя пользователя не должно быть пустым").notEmpty()],
  authController.login
);
router.post(
  "/registration",
  upload,
  [
    body("username", "Имя пользователя не должно быть пустым").notEmpty(),
    body("email", "Введен невалидная электронная почта").isEmail(),
    body("password", "Пароль должен содержать минимум 4 символа").isLength({
      min: 4,
    }),
  ],
  authController.registration
);
router.get("/refresh", authController.refresh);
router.get("/logout", authController.logout);
router.post("/sendReset", authController.sendReset);
router.post("/reset/:token", recoveryMiddleware, authController.reset);

export default router;
