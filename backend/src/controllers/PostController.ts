import { Response, Request } from "express";

// Appwrite
import { storage } from "../config/appwrite";

// Configs
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import Post from "../models/post.model";
import { InputFile } from "node-appwrite/file";

export const Posts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
        caption,
        tag,
        users,
        song,
        is_paid
    } = req.query

    const fileId:string = `${req.signedInUser?.id}-${Date.now().toString().slice(-6)}`

    const isUploaded = await storage.createFile(
        process.env.POST_BUCKET_ID as string,
        fileId as string,
        InputFile.fromBuffer(req.body, `${req.signedInUser?.id}-${Date.now().toString().slice(-6)}.jpg`)
    )

    if(!isUploaded){
        res.status(500).json({
            ok: false,
            msg: "Unable to post."
        })
        return;
    }

    const isPost = await Post.create({
        users: users?users?.toString().split('-'):req.signedInUser?.id,
        post: `https://fra.cloud.appwrite.io/v1/storage/buckets/${
          process.env.POST_BUCKET_ID as string
        }/files/${fileId}/view?project=${
          process.env.APPWRITE_PROJECT_ID as string
        }&mode=admin`,
        caption: caption?caption:"",
        tag: tag?tag?.toString().split("-"):[],
        song: song?song:"",
        is_paid
    })

    if(!isPost){
        res.status(500).json({
            ok: false,
            msg:'Unable to create post.'
        })
        return;
    }
    

    res.status(201).json({
        ok: true,
        msg: 'Post uploaded successfully.',
        post: isPost
    })
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "Post Controller");
  }
};
