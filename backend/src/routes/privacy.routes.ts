import {Router} from 'express'

// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

// Controller
import {
    BlockUser,
    UnblockUser,
    GetBlockedUser,
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

router.post('/block', IsLoggedIn, BlockUser)

router.put('/show-read-receiptes', IsLoggedIn, ShowReadReceiptes)
router.put('/show-online-status', IsLoggedIn, ShowOnlineReceiptes)
router.put('/show-typing-status', IsLoggedIn, ShowTypingStatus)
router.put('/who-can-message', IsLoggedIn, WhoCanMessage)
router.put('/who-can-men-tag', IsLoggedIn, WhoCanMenTag)
router.put('/end-to-end-ecryption', IsLoggedIn, EndToEndEcryption)

router.delete('/unblock', IsLoggedIn, UnblockUser)


export default router;