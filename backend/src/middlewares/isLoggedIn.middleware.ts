import { Response, Request, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/user.model";

declare global {
    namespace Express {
        // Declaring a new object in Request interface to get the user info in controller if the user is signed in.
        interface Request {
            signedInUser: IUser
        }
    }
}



export const IsLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {session} = req.cookies

        if(!session){
            res.status(401).json({
                ok: false,
                msg: "No Session Token Provided."
            })
            return;
        }

        const decodedSession = jwt.verify(session, process.env.JWT_SECRET as string) as {userId: string}
        if(!decodedSession){
            res.status(400).json({
                ok: false,
                msg: "Invalid Session Token."
            })
            return;
        }

        const user = await User.findById(decodedSession.userId).select('-password')
        if(!user){
            res.status(404).json({
                ok: false,
                msg: "User Not Found."
            })
            return;
        }

        req.signedInUser = user;
        
        next()
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, 'IsLoggedIn Middleware.')
    }
}