import express, {Router} from 'express'


// Middleware
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

// Controller
import {
    GetUser,
    UpdateProfile,
    AddLink,
    RemoveLink,
    EditLink,
    GetLinks
} from '../controllers/UserController'

const router:Router = Router()


router.get('/', IsLoggedIn, GetUser)
router.put('/update-profile', IsLoggedIn, UpdateProfile)
router.post('/link', IsLoggedIn, AddLink)
router.put('/link', IsLoggedIn, EditLink)
router.delete('/link', IsLoggedIn, RemoveLink)
router.get('/link', IsLoggedIn, GetLinks)


export default router;