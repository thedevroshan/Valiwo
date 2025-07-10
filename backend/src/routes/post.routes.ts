import express from 'express'


// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware'

// Controller
import {
    Posts
} from "../controllers/PostController"

const router:express.Router = express.Router()


router.post('/', IsLoggedIn, Posts) // Query -> ?caption=""&tag=id1-id2&users=id1-id2&song=""&is_paid=false/true

export default router

