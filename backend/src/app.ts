import express from 'express';
import { configDotenv } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import {Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback} from 'passport-google-oauth20';



configDotenv();

const app = express();
const PORT = process.env.PORT || 7000;

import { connectDB } from './config/db';

// Routes
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import followRoutes from './routes/follow.routes';
import postRoutes from './routes/post.routes'
import profileRoutes from './routes/profile.routes'
import accountRoutes from './routes/account.routes'
import privacyRoutes from './routes/privacy.routes'
import noteRoutes from './routes/note.routes'


app.use(express.json());
app.use(express.raw({type: '*/*', limit: '20MB'}))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))
app.use(passport.initialize());

// Connect to MongoDB
connectDB();


// Passport.js configuration for Google OAuth and GitHub OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: "/api/v1/auth/google/signin"
}, (accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
  interface GoogleOAuthProfile {
    fullname: string,
    email: string,
    profile_pic: string
  }

  const user: GoogleOAuthProfile = {
    fullname: profile.displayName,
    email: profile.emails ? profile.emails[0].value : '',
    profile_pic: profile.photos ? profile.photos[0].value : ''
  }
  return done(null, user);
}));

// ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/follow', followRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/settings/profile', profileRoutes);
app.use('/api/v1/settings/account', accountRoutes);
app.use('/api/v1/settings/privacy', privacyRoutes);
app.use('/api/v1/note', noteRoutes)

app.listen(PORT, () => {
    if(process.env.NODE_ENV !== 'production') {
        console.log(`Server is running on http://localhost:${PORT}`);
        return;
    }
    console.log("SERVER IS RUNNING.");
});