import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import {Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback} from 'passport-google-oauth20';
import {Strategy as GitHubStrategy, Profile as GitHubProfile} from 'passport-github2';



configDotenv();

const app = express();
const PORT = process.env.PORT || 7000;

import { connectDB } from './config/db';

// Routes
import authRoutes from './routes/auth.route';


app.use(express.json());
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
  const user ={
    displayName: profile.displayName,
    email: profile.emails ? profile.emails[0].value : '',
    profilePic: profile.photos ? profile.photos[0].value : ''
  }
  return done(null, user);
}));

// ROUTES
app.use('/api/v1/auth', authRoutes);

app.listen(PORT, () => {
    if(process.env.NODE_ENV !== 'production') {
        console.log(`Server is running on http://localhost:${PORT}`);
        return;
    }
    console.log("SERVER IS RUNNING.");
});