import { Request, Response, NextFunction} from "express";

import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";


import { UserSchema } from "../schema/user.schema";

export const UserSchemaValidator = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const parsedData = UserSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                ok: false,
                message: parsedData.error.errors[0].message,
            });
            return;
        }
        next();
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "UserSchema Middleware");
    }
}