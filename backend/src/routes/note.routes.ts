import express from 'express'

// Middlewares
import { IsLoggedIn } from '../middlewares/isLoggedIn.middleware';

// Controller
import {
    AddNote,
    DeleteNote,
    GetAllNotes,
    GetUserWhoLikedMyNote,
    LikeNote
} from '../controllers/NoteController'

const router:express.Router = express.Router()


router.get('/',IsLoggedIn, GetAllNotes)
router.get('/liked-my-note', IsLoggedIn, GetUserWhoLikedMyNote)

router.post('/', IsLoggedIn, AddNote)

router.put('/like', IsLoggedIn, LikeNote) // like?note_id=<note_id>

router.delete('/', IsLoggedIn, DeleteNote) // /?note_id=<note_id>


export default router;