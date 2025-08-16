import {Request, Response} from 'express'
import bcryptjs from 'bcryptjs'
import z from 'zod'

// Config
import { INTERNAL_SERVER_ERROR } from '../config/commonErrors'

// Models
import User, { EAccountType, ETwoFactorAuth, IUser } from '../models/user.model'
import { SendEmailVerificationMail } from '../utils/SendEmailVerificationMail';

// Utils
import { HashPassword } from '../utils/HashPassword'


export const ChangeEmail = async(req: Request, res: Response):Promise<void> => {
    try {
        const {email} = req.query;

        if(typeof email !== 'string' || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            res.status(400).json({
                ok: false,
                msg: 'Email is required.'
            })
            return;
        }

        const isUserUpdated = await User.findByIdAndUpdate(req.signedInUser?.id, {
            $set: {
                email,
                is_verified: false,
            }
        })

        if(!isUserUpdated){
            res.status(400).json({
                ok: false,
                msg: 'Unable to update user.'
            })
            return;
        }

        const isSent = await SendEmailVerificationMail(email, isUserUpdated.id, 'email')
        if(!isSent){
            res.status(400).json({
                ok: false,
                msg: "Unable to sent verification link for this email."
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Email changed. Check inbox to verify email.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "ChangeEmail")
    }
}

export const ChangePhone = async(req: Request, res: Response):Promise<void> => {
    try {
        const {phone} = req.query;

        if(typeof phone !== 'string' || !phone){
            res.status(400).json({
                ok: false,
                msg: 'Phone is required.'
            })
            return;
        }

        const isPhoneUpdated = await User.findByIdAndUpdate(req.signedInUser?.id, {
            $set: {
                phone
            }
        })

        if(!isPhoneUpdated){
            res.status(400).json({
                ok: false,
                msg: 'Unable to change phone number. Try again later.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: "Phone number changed."
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "ChangePhone")
    }
}

export const ChangePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password, confirm_password, current_password } = req.body;

    const passwordSchema = z.object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          }
        ),
    });

    const validation = passwordSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        msg: validation.error.errors[0].message,
      });
      return;
    }

    if (password !== confirm_password) {
      res.status(400).json({
        ok: false,
        msg: "Password should be same as Confirm Password.",
      });
      return;
    }

    const user = await User.findById(req?.signedInUser?.id);

    if (!user) {
      res.status(404).json({
        ok: false,
        msg: "User not found.",
      });
      return;
    }

    const isPasswordMatch = await bcryptjs.compare(
      current_password,
      user.password
    );
    if (!isPasswordMatch) {
      res.status(400).json({
        ok: false,
        msg: "Incorrect Current Password.",
      });
      return;
    }

    user.password = (await HashPassword(password)) as string;
    await user.save();

    res.status(200).json({
      ok: true,
      msg: "Password Changed Successfully.",
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "ChangePassword");
  }
};

export const ChangeRecoveryEmail = async(req: Request, res: Response):Promise<void> => {
    try {
        const {email} = req.query;
        
        if(!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            res.status(400).json({
                ok: false,
                msg: "Email is requried."
            })
            return;
        }

        if(email == req.signedInUser?.email){
            res.status(400).json({
                ok: false,
                msg: "Default email can't be the recovery email, use different email."
            })
            return;
        }

        const isUserUdpated = await User.findByIdAndUpdate(req.signedInUser?.id, {
            $set: {
                recovery_email: email,
                is_recovery_email_verified: false,
            }
        })

        if(!isUserUdpated){
            res.status(400).json({
                ok: false,
                msg: 'Unable to change recovery email. Try again later.'
            })
            return;
        }

        const isSent:boolean = await SendEmailVerificationMail(email, isUserUdpated.id, 'recovery_email')
        if(!isSent){
            res.status(400).json({
                ok: false,
                msg: 'Unable to sent verification link for this email. Try again later or with different email.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Recovery email changed. Check inbox to verify recovery email.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "ChangeRecoveryEmail")
    }
}

export const EnableDisableTwoFactAuth = async(req: Request, res: Response):Promise<void> => {
    try {
        const isUpdated = await User.findByIdAndUpdate(req.signedInUser?.id, {
            $set: {
                is_two_factor_auth: !req.signedInUser?.is_two_factor_auth
            }
        })

        if(!isUpdated){
            res.status(400).json({
                ok: false,
                msg: 'Unabel to toggle Two Factor Authentication.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Two Factor Authentication Toggled.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "EnableDisableTwoFactAuth")
    }
}

export const ChangeTwoFactAuthOpt = async(req: Request, res: Response):Promise<void> => {
    try {
        const {option} = req.query;

        if(!option || typeof option !== 'string'){
            res.status(400).json({
                ok: false,
                msg: 'Otpion query is required.'
            })
            return;
        }

        const validOptions:string[] = [ETwoFactorAuth.EMAIL, ETwoFactorAuth.BOTH, ETwoFactorAuth.SMS]

        const isUpdated = await User.findByIdAndUpdate(req.signedInUser?.id, {
            $set: {
                two_factor_auth_option: validOptions.includes(option)?option:ETwoFactorAuth.EMAIL
            }
        })

        if(!isUpdated){
            res.status(400).json({
                ok: false,
                msg: 'Unabel to change the two factor authetntication option. Try again later.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Two Factor Authentication option changed.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "ChangeTwoFactAuthOpt")
    }
}

export const ChangeAccountType = async (req: Request, res: Response):Promise<void> => {
    try {
        const account_type = typeof req.query.type === 'string' ? req.query.type : '';

        const accountType: string[] = [EAccountType.PERSONAL, EAccountType.CREATOR];

        if (!account_type || typeof account_type !== 'string') {
            res.status(400).json({
                ok: false,
                msg: "Invalid account type query."
            });
            return;
        }

        if (!accountType.includes(account_type)) {
            res.status(400).json({
                ok: false,
                msg: "Account type must be either personal or creator."
            });
            return;
        }


        if(account_type as EAccountType == EAccountType.CREATOR){
            const isChanged = await User.findByIdAndUpdate(req.signedInUser?.id, {
                $set: {
                    account_type: EAccountType.CREATOR,
                    is_private: false, // As creator account cannot be private
                }
            })

            if(!isChanged){
                res.status(400).json({
                    ok: false,
                    msg: 'Unable to change account to creator type. Try again later.'
                })
                return;
            }
        }
        
        if(account_type as EAccountType.PERSONAL == EAccountType.PERSONAL){
            const isChanged = await User.findByIdAndUpdate(req.signedInUser?.id, {
                $set: {
                    account_type: EAccountType.PERSONAL
                }
            })

            if(!isChanged){
                res.status(422).json({
                    ok: false,
                    msg: 'Unable to change account to personal type. Try again later.'
                })
                return;
            }
        }


        res.status(200).json({
            ok: true,
            msg: 'Account type changed.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "ChangeAccountType")
    }
}

export const DeactivateAccount = async (req: Request, res: Response):Promise<void> => {
    try {
        const isDeactivated = await User.findByIdAndUpdate(req.signedInUser?.id, {
            $set: {
                is_deactivated: true
            }
        })

        if(!isDeactivated){
            res.status(400).json({
                ok: false,
                msg: 'Unable to deactivate account.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Account deactivated.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "DeactivateAccount")
    }
}

export const DeleteAccountRequest = async (req: Request, res: Response):Promise<void> => {
    try {
        const deletionDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))

        const isSetForDeletion = await User.findByIdAndUpdate(req.signedInUser?.id, {
            $set: {
                is_requested_deletion: true,
                will_be_deleted_on: deletionDate
            }
        })

        if(!isSetForDeletion){
            res.status(400).json({
                ok: false,
                msg: 'Unable to set the your account for deletion.'
            })
            return;
        }

        res.status(200).json({
            ok:true,
            msg: `Your account is now scheduled for deletion. Account will be deleted on ${deletionDate.toLocaleDateString}. However, if you change your mind, you can login back to your account anytime before ${deletionDate.toLocaleTimeString}.`,
            deletionDate
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "DeleteAccountRequest")
    }
}