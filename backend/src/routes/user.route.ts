import express, {Router} from 'express'


// Middleware
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

// Controller
import {
    GetUser,
    UpdateProfile,
    AddLink
} from '../controllers/UserController'

const router:Router = Router()


router.get('/', IsLoggedIn, GetUser)
router.put('/update-profile', IsLoggedIn, UpdateProfile)
router.post('/link', IsLoggedIn, AddLink)


export default router;