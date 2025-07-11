import express from 'express'


// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware'

// Controller
import {
    Posts,
    LikeUnlikePost,
    PostComment,
    DeleteComment,
    DeletePost,
    PublicPosts,
    PaidPosts,
    EditPost
} from "../controllers/PostController"

const router:express.Router = express.Router()

router.get('/', IsLoggedIn, PublicPosts)
router.get('/paid_posts', IsLoggedIn, PaidPosts)

router.post('/post', IsLoggedIn, Posts) // Query -> ?caption=""&tag=id1-id2&users=id1-id2&song=""&is_paid=false/true
router.post('/like-unlike', IsLoggedIn, LikeUnlikePost) // Query -> ?post_id=id
router.post('/comment', IsLoggedIn, PostComment) // Query -> ?post_id=""&comment=""


router.put('/edit-post', IsLoggedIn, EditPost)


router.delete('/comment', IsLoggedIn, DeleteComment) // Query -> ?comment_id=""
router.delete('/post', IsLoggedIn, DeletePost) // Query -> ?post_id=""

export default router

