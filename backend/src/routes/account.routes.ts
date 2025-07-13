import express from 'express'

// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

// Controller
import {
    ChangeEmail,
    ChangePassword,
    ChangePhone,
    ChangeRecoveryEmail,
    EnableDisableTwoFactAuth,
    ChangeTwoFactAuthOpt,
    ChangeAccountVisibility,
    DeactivateAccount,
    DeleteAccountRequest
} from '../controllers/AccountController'

const router:express.Router = express.Router()

router.put('/email', IsLoggedIn, ChangeEmail);
router.put('/phone', IsLoggedIn, ChangePhone);
router.put('/password', IsLoggedIn, ChangePassword);
router.put('/recovery-email', IsLoggedIn, ChangeRecoveryEmail)
router.put('/two-factor-auth', IsLoggedIn, EnableDisableTwoFactAuth)
router.put('/two-factor-auth-option', IsLoggedIn, ChangeTwoFactAuthOpt)
router.put('/account-visibility', IsLoggedIn, ChangeAccountVisibility)

router.put('/deactivate', IsLoggedIn, DeactivateAccount)
router.put('/delete-request', IsLoggedIn, DeleteAccountRequest)

export default router;