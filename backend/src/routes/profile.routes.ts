import express from 'express'

// Controller
import {
    GetProfile,
    GetLinks,
    AddLink,
    UpdateProfile,
    ChangeProfilePic,
    EditLink,
    RemoveLink,
    RemoveProfilePic
} from "../controllers/ProfileController"

// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

const router:express.Router = express.Router()

router.get('/', IsLoggedIn, GetProfile)
router.get("/link", IsLoggedIn, GetLinks);

router.post("/link", IsLoggedIn, AddLink);

router.put("/update-profile", IsLoggedIn, UpdateProfile);
router.put("/profile-pic", IsLoggedIn, ChangeProfilePic);
router.put("/link", IsLoggedIn, EditLink);

router.delete("/profile-pic", IsLoggedIn, RemoveProfilePic);
router.delete("/link", IsLoggedIn, RemoveLink);

export default router;