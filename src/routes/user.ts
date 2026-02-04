import express from "express";
import { authenticate } from "../middlewares/auth";
import {
  handleLoginUser,
  handleRegisterUser,
  userLogin,
  userLogout,
} from "../controllers/user-auth";

const router = express.Router();

router.post("/user/register", handleRegisterUser);
router.post("/user/login", handleLoginUser);
router.get("/me", authenticate, userLogin);
router.post("/user/logout", authenticate, userLogout);

export default router;
