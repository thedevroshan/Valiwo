import { Response, Request, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";
import User, { IUser } from "../models/user.model";
import Blocked from "../models/blocked.model";
import mongoose from "mongoose";




export const IsLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.body;

        if(!userId || !mongoose.isValidObjectId(userId)){
            res.status(400).json({
                ok: false,
                msg: 'UserId is required.'
            })
            return;
        }

        const isUser = await User.exists({_id: userId})
        if(!isUser){
            res.status(404).json({
                ok: false,
                msg: 'User not found.'
            })
            return;
        }

        const isBlocked = await Blocked.exists({blocked_by: req.signedInUser?.id, blocked: userId}) || await Blocked.exists({blocked_by: userId, blocked: req.signedInUser?.id})

        if(isBlocked){
            res.status(400).json({
                ok: true,
                msg: 'User is blocked.'
            })
            return;
        }
        
        next()
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, 'IsLoggedIn Middleware.')
    }
}