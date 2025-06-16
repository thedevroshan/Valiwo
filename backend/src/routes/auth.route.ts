import express from 'express';
import passport, { session } from 'passport';

// Controllers
import {
    SignUp,
    VerifyEmail,
    SignIn,
    SignOut,
    GoogleSignIn
} from '../controllers/AuthController';

// Middlewares
import { SignUpSchemaValidator } from '../middlewares/signupSchemaValidator.middleware';

const router:express.Router = express.Router();


router.post('/signup',SignUpSchemaValidator,SignUp);
router.get('/verify-email', VerifyEmail)
router.get('/signin', SignIn);
router.get('/signout', SignOut);

// OAuth2
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/signin',passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/auth/google-login-failed`, session: false}),GoogleSignIn);


export default router;