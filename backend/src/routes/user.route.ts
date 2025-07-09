import express, { Router } from "express";

import { UserSchemaValidator } from "../middlewares/userSchemaValidator.middleware";

// Middleware
import { IsLoggedIn } from "../middlewares/isLoggedIn.middleware";

// Controller
import {
  GetUser,
  UpdateProfile,
  AddLink,
  RemoveLink,
  EditLink,
  GetLinks,
  ChangeProfilePic,
  RemoveProfilePic,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
} from "../controllers/UserController";

const router: Router = Router();

router.get("/", IsLoggedIn, GetUser);
router.get("/link", IsLoggedIn, GetLinks);
router.get("/forgot-password", ForgotPassword);

router.post("/link", IsLoggedIn, AddLink);

router.put("/update-profile", IsLoggedIn, UpdateProfile);
router.put("/profile-pic", IsLoggedIn, ChangeProfilePic);
router.put("/link", IsLoggedIn, EditLink);
router.put("/reset-password", ResetPassword);
router.put("/change-password", IsLoggedIn, ChangePassword);

router.delete("/profile-pic", IsLoggedIn, RemoveProfilePic);
router.delete("/link", IsLoggedIn, RemoveLink);

export default router;
