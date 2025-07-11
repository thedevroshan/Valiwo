import { Response, Request } from "express";

// Appwrite
import { storage } from "../config/appwrite";

// Configs
import { INTERNAL_SERVER_ERROR } from "../config/commonErrors";

// Models
import Post, {IPost} from "../models/post.model";
import Like from "../models/like.model";
import Comment from "../models/comment.model";
import User from "../models/user.model";

// Appwrite
import { InputFile } from "node-appwrite/file";
import mongoose, { mongo } from "mongoose";


export const PublicPosts = async (req: Request, res: Response):Promise<void> => {
  try {
    const posts:IPost[] = await Post.find({users: req.signedInUser?.id})  

    const publicPosts:IPost[] = posts.map((post) => {
      if(!post.is_paid){
        return post.toObject()
      }
    })  

    if(!posts){
      res.status(404).json({
        ok: true,
        msg: "No Posts."
      })
      return;
    }

    res.status(200).json({
      ok: true,
      msg: 'All public posts fetched.',
      posts: publicPosts[0] != null?publicPosts:[]
    })
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "AllPost Controller.")
  }
}


export const PaidPosts = async (req: Request, res: Response):Promise<void> => {
  try {
    const paidPosts:IPost[] = await Post.find({user: req.signedInUser?.id, is_paid: true})

    if(!paidPosts) {
      res.status(404).json({
        ok: true,
        msg: "No Paid Posts."
      })
      return;
    }

    res.json({
      ok: true,
      msg: "All paid posts.",
      paid_posts: paidPosts
    })
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "PaidPost")
  }
}


export const Posts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { caption, tag, users, song, is_paid } = req.query;

    const fileId: string = `${req.signedInUser?.id}-${Date.now()
      .toString()
      .slice(-6)}`;

    const isUploaded = await storage.createFile(
      process.env.POST_BUCKET_ID as string,
      fileId as string,
      InputFile.fromBuffer(
        req.body,
        `${req.signedInUser?.id}-${Date.now().toString().slice(-6)}.jpg`
      )
    );

    if (!isUploaded) {
      res.status(500).json({
        ok: false,
        msg: "Unable to post.",
      });
      return;
    }

    const isPost = await Post.create({
      users: users ? users?.toString().split("-") : req.signedInUser?.id,
      post: `https://fra.cloud.appwrite.io/v1/storage/buckets/${
        process.env.POST_BUCKET_ID as string
      }/files/${fileId}/view?project=${
        process.env.APPWRITE_PROJECT_ID as string
      }&mode=admin`,
      post_file_id: fileId,
      caption: caption ? caption : "",
      tag: tag ? tag?.toString().split("-") : [],
      song: song ? song : "",
      is_paid,
    });

    if (!isPost) {
      res.status(500).json({
        ok: false,
        msg: "Unable to create post.",
      });
      return;
    }

    await User.updateOne({_id: req.signedInUser?.id}, {
      $inc:{
        posts: 1
      }
    })

    res.status(201).json({
      ok: true,
      msg: "Post uploaded successfully.",
      post: isPost,
    });
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "Post Controller");
  }
};

export const LikeUnlikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { post_id } = req.query;

    if (!post_id || typeof post_id != "string") {
      res.status(400).json({
        ok: false,
        msg: "Invalid Post Id.",
      });
      return;
    }

    const isAlreadyLiked = await Like.findOne({
      post_id,
      liked_by: req.signedInUser?.id,
    });
    if (isAlreadyLiked) {
      await Like.findOneAndDelete({post_id, liked_by: req.signedInUser?.id});
      await Post.findByIdAndUpdate(post_id, {
        $inc: {
          like_count: -1,
        },
      });

      res.status(200).json({
        ok: true,
        msg: "Unliked successfuly.",
      });
    } else {
      const isLiked = await Like.create({
        post_id,
        liked_by: req.signedInUser?.id,
      });

      if (!isLiked) {
        res.status(500).json({
          ok: false,
          msg: "Unable to like.",
        });
        return;
      }

      await Post.findByIdAndUpdate(post_id, {
        $inc: {
          like_count: +1,
        },
      });

      res.status(200).json({
        ok: true,
        msg: "Liked Successfully.",
      });
    }
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "Like Post Controller");
  }
};


export const PostComment = async (req: Request, res: Response):Promise<void> => {
  try {
    const {post_id, comment} = req.query;

    if(!post_id || typeof post_id !== "string" || !comment || typeof comment !== "string" || !mongoose.isValidObjectId(post_id)){
      res.status(400).json({
        ok: false,
        msg: 'PostId and Comment is required.'
      })
      return;
    }

    const isPost = await Post.findById(post_id)
    if(!isPost){
      res.status(404).json({
        ok: false,
        msg: "Post not found."
      })
      return;
    }
    
    const isComment = await Comment.create({
      post_id,
      comment_by: req.signedInUser?.id,
      comment
    })

    if (!isComment){
      res.status(500).json({
        ok: false,
        msg:'Unable to post comment.'
      })
      return;
    }

    await Post.findByIdAndUpdate(post_id, {
      $inc: {
        comment_count: 1
      }
    })

    res.status(201).json({
      ok: true,
      msg: 'Comment posted.',
      comment: isComment
    })
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "Comment Controller.")
  }
}


export const DeleteComment = async (req: Request, res: Response):Promise<void> => {
  try {
    const {comment_id} = req.query;

    if(!comment_id || typeof comment_id !== 'string' || !mongoose.isValidObjectId(comment_id)){
      res.status(400).json({
        ok: false,
        msg: 'CommentId is required.'
      })
      return;
    }

    const isDeleted = await Comment.findByIdAndDelete(comment_id)
    if(!isDeleted){
      res.status(400).json({
        ok: false,
        msg: 'Unable to delete comment.'
      })
      return;
    }

    await Post.findByIdAndUpdate(isDeleted?.post_id, {
      $inc: {
        comment_count: -1
      }
    })

    res.status(200).json({
      ok: true,
      msg: "Comment deleted.",
    })
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "Comment Controller.")
  }
}

export const DeletePost = async (req: Request, res: Response):Promise<void> => {
  try {
    const {post_id} = req.query;

    const post = await Post.findById(post_id)
    if(!post){
      res.status(404).json({
        ok: false,
        msg: "Post not found."
      })
      return;
    }

    if(!post?.users.includes(req.signedInUser?.id)){
      res.status(401).json({
        ok: false,
        msg: "You are not authorized to delete this post."
      })
      return;
    }

    const isLikeDeleted = await Like.deleteMany({post_id})
    const isCommentDeleted = await Comment.deleteMany({post_id})
    const isPostDeleted = await Post.deleteOne({_id: post_id})

    const isUserUpdated = await User.findByIdAndUpdate(req.signedInUser?.id, {
      $inc: {
        posts: -1
      }
    })

    const isFileDeleted = await storage.deleteFile(process.env.POST_BUCKET_ID as string, post.post_file_id[0] as string)

    if(!isLikeDeleted || !isCommentDeleted || !isUserUpdated || !isPostDeleted || !isFileDeleted){
      res.status(400).json({
        ok: false,
        msg: 'Unable to delete this post.'
      })
      return;
    }

    res.status(200).json({
      ok: true,
      msg: "Post deleted successfully."
    })
  } catch (error) {
    INTERNAL_SERVER_ERROR(res, error, "Delete Post")
  }
}

export const EditPost = async (req: Request, res: Response):Promise<void> => {
  try {
    const {post_id,caption} = req.query;

    if(typeof caption !== 'string' || !post_id || !mongoose.isValidObjectId(post_id)){
      res.status(400).json({
        ok: false,
        msg:'Either post id is not given or caption.'
      })
      return;
    }

    const isEdited = await Post.findOneAndUpdate({_id: post_id, users: req.signedInUser?.id}, {
      $set: {
        caption
      }
    })

    if(!isEdited){
      res.status(400).json({
        ok: false,
        msg: 'Unable to edit post. Try again later.'
      })
      return;
    }

    res.json({
      ok: true,
      msg: "Post edited."
    })
  } catch (error) {
    INTERNAL_SERVER_ERROR(res,error, "EditPost Controller.")
  }
}