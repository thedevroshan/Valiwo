import {Router} from 'express'

// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

// Controller
import {
    BlockUser,
    RestrictUser,
    UnblockUser,
    UnrestrictUser,
    GetBlockedUser,
    GetRestrictedUser,
    GetPrivacySettings,
    ShowOnlineReceiptes,
    ShowReadReceiptes,
    ShowTypingStatus,
    WhoCanMessage,
    WhoCanMenTag,
    EndToEndEcryption
} from "../controllers/PrivacyController"

const router:Router = Router()

router.get('/', IsLoggedIn, GetPrivacySettings)
router.get('/blocked-user', IsLoggedIn, GetBlockedUser)
router.get('/restricted-user', IsLoggedIn, GetRestrictedUser)

router.post('/block', IsLoggedIn, BlockUser)
router.post('/restrict', IsLoggedIn, RestrictUser)

router.put('/show-read-receiptes', IsLoggedIn, ShowReadReceiptes)
router.put('/show-online-status', IsLoggedIn, ShowOnlineReceiptes)
router.put('/show-typing-status', IsLoggedIn, ShowTypingStatus)
router.put('/who-can-message', IsLoggedIn, WhoCanMessage)
router.put('/who-can-men-tag', IsLoggedIn, WhoCanMenTag)
router.put('/end-to-end-ecryption', IsLoggedIn, EndToEndEcryption)

router.delete('/unblock', IsLoggedIn, UnblockUser)
router.delete('/unrestrict', IsLoggedIn, UnrestrictUser)


export default router;