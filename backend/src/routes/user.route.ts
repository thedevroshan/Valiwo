import express, { Router } from "express";

import { UserSchemaValidator } from "../middlewares/userSchemaValidator.middleware";

// Middleware
import { IsLoggedIn } from "../middlewares/isLoggedIn.middleware";

// Controller
import {
  GetUser,
  ForgotPassword,
  ResetPassword,
} from "../controllers/UserController";

const router: Router = Router();

router.get("/", IsLoggedIn, GetUser);
router.get("/forgot-password", ForgotPassword);


router.put("/reset-password", ResetPassword);


export default router;
