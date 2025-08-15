import {Request, Response} from 'express'
import mongoose from 'mongoose'


// Configs
import { INTERNAL_SERVER_ERROR } from '../config/commonErrors'

// Models
import Note from '../models/note.model'
import User from '../models/user.model'

export const GetAllNotes = async (req: Request, res: Response):Promise<void> => {
    try {
        const usersAllowedToShowNote = req.signedInUser.followers.map(follower => {
            if(req.signedInUser.following.includes(follower)){
                return follower;
            }
        })

        const userNote = await Note.findOne({userId: req.signedInUser?.id})

        if(usersAllowedToShowNote.length == 0 && !userNote){
            res.status(200).json({
                ok: true,
                msg: "No notes."
            })
            return;
        }

        const notes = await Promise.all(usersAllowedToShowNote.map(async user => {
            const note = await Note.findOne({userId: user})
            if(note){
                return note
            }
        }))

        if(notes.length == 0 && !userNote){
            res.status(200).json({
                ok: true,
                msg: 'No notes.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: "All notes.",
            data: [...notes, userNote]
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "GetAllNotes Controller")   
    }
}


export const GetUserWhoLikedMyNote = async (req: Request, res: Response):Promise<void> => {
    try {
        const note = await Note.findOne({userId: req.signedInUser?.id})

        if(!note){
            res.status(404).json({
                ok: false,
                msg: 'Note not found.'
            })
            return;
        }

        const userDetails = await Promise.all(note.likes.map(async userId => {
            const user = await User.findById(userId).select('username fullname profile_pic')
            if(user)
                return user
        }))

        if(userDetails.length == 0){
            res.status(200).json({
                ok: true,
                msg: "No user liked yet."
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: "User who liked.",
            data: userDetails
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res, error, "GetUserWhoLikedMyNote Controller")   
    }
}

export const AddNote = async (req: Request, res: Response):Promise<void> => {
    try {
        const {msg, song} = req.body

        if(!msg && !song){
            res.status(400).json({
                ok: false,
                msg: "Song or msg is required."
            })
            return;
        }

        const isNewNote = await Note.create({
            userId: req.signedInUser?.id,
            msg,
            song
        })

        if(!isNewNote){
            res.status(500).json({
                ok: false,
                msg: "Unable to post note. Try again later."
            })
            return;
        }

        res.status(201).json({
            ok: true,
            msg: "Note posted.",
            data: isNewNote
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res,error, "AddNote Controller")
    }
}

export const LikeNote = async (req: Request, res: Response):Promise<void> => {
    try {
        const {note_id} = req.query

        if(!note_id || !mongoose.isValidObjectId(note_id)){
            res.status(400).json({
                ok: false,
                msg: "Note Id is requried."
            })
            return;
        }

        const note = await Note.findById(note_id)

        if(!note){
            res.status(404).json({
                ok: false,
                msg: 'Note not found.'
            })
            return;
        }
        
        if(!req.signedInUser.followers.includes(note?.userId as mongoose.Schema.Types.ObjectId) && !req.signedInUser.following.includes(note?.userId as mongoose.Schema.Types.ObjectId)){
            res.status(400).json({
                ok: false,
                msg: 'You are not allowed to like this note.'
            })
            return;
        }

        note.likes.push(req.signedInUser.id)
        const isLiked = await note.save()

        if(!isLiked){
            res.status(500).json({
                ok: false,
                msg: 'Unable to like note. Try again later.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Note liked.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res,error, "LikeNote Controller")
    }
}


export const DeleteNote = async (req: Request, res: Response):Promise<void> => {
    try {
        const {note_id} = req.query

        if(!note_id || !mongoose.isValidObjectId(note_id)){
            res.status(400).json({
                ok: false,
                msg: "Note Id is requried."
            })
            return;
        }

        const isDeleted = await Note.findOneAndDelete({_id: note_id, userId: req.signedInUser?.id})
        if(!isDeleted){
            res.status(500).json({
                ok: false,
                msg: 'Unable to delete note. Try again later.'
            })
            return;
        }

        res.status(200).json({
            ok: true,
            msg: 'Note deleted.'
        })
    } catch (error) {
        INTERNAL_SERVER_ERROR(res,error, "DeleteNote Controller")
    }
}
