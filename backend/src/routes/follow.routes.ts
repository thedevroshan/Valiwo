import express from 'express';

// Controllers
import {
    FollowUnfollowUser,
    AcceptFollowRequest,
    RemoveFollower,
    DeleteFollowRequest,
    GetFollowers,
    GetFollowing,
    IsRequestedFollow
} from "../controllers/FollowController";

// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

const router:express.Router = express.Router();

router.get('/followers', IsLoggedIn, GetFollowers);
router.get('/following', IsLoggedIn, GetFollowing);
router.get('/is-requested', IsLoggedIn, IsRequestedFollow);

router.put("/follow-unfollow", IsLoggedIn, FollowUnfollowUser);
router.put("/accept-follow-request", IsLoggedIn, AcceptFollowRequest);
router.put("/remove-follower", IsLoggedIn, RemoveFollower);


router.delete("/delete-follow-request", IsLoggedIn, DeleteFollowRequest);

export default router;