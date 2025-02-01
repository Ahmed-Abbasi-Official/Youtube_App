import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// CREATE COMMENT

export const createComment = asyncHandler( async (req,res)=>{

    // GET COMMMENT FROM USER

    const {comment , videoId} = req.body;

    // VALIDATION FOR UPCOMENT COMMENT

    if([comment , videoId].some((p)=>p.trim() === "")){
        throw new ApiError(400,"All fields are required");
    }

    // CREATE COMMENT

    const newComment = await Comment.create({comment, video:videoId, user: req.user._id });

    if(!newComment){
        throw new ApiError(500,"Failed to create comment");
    }

    // RETURN RESPONSE

    return res.status(201).json(new ApiResponse(201, newComment, "Comment created successfully"));

} )

// GET ALL COMMENTS FOR A VIDEO

export const getCommentsForVideo = asyncHandler( async (req,res)=>{

    // GET COMMENTS FOR VIDEO

    const comments = await Comment.find({video: req.params.id}).populate({ path: "user", select: "-password" }).sort({createdAt:-1});

    if(!comments){
        throw new ApiError(404,"No comments found for this video");
    }

    // RETURN RESPONSE

    return res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));

} )

// DELETE COMMENT

export const deleteComment = asyncHandler( async (req,res)=>{

    // GET COMMENT

    const comment = await Comment.findById(req.params.id);

    // CHECK COMMENT

    if(!comment){
        throw new ApiError(404,"Comment not found");
    }

    // DELETE COMMENT

    await Comment.findByIdAndDelete(comment?._id);

    // RETURN RESPONSE

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));

} )

// UPDATE COMMENT

export const updateComment = asyncHandler( async (req,res)=>{

    // GET COMMENT

    const {comment} = req.body;

    // CHECK COMMENT

    if(!comment){
        throw new ApiError(404,"Comment not found");
    }

    // UPDATE COMMENT


    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {comment}, {new: true});

    if(!updatedComment){
        throw new ApiError(500,"Failed to update comment");
    }

    // RETURN RESPONSE

    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));

} )

// LIKED VIDEOS

export const likeComment = asyncHandler( async(req,res)=>{

    if(!req?.user?._id){
        throw new ApiError(401,"You are not authenticated");
    }

    // GET COMMENT

    const comment = await Comment.findById(req.params.id);

    // VALIDATION FOR COMMENT

    if(!comment){
        throw new ApiError(404,"Comment not found");
    }

    // CHECK IF USER ALREADY LIKED THE COMMENT

    const isLiked = comment?.likes?.includes(req?.user?._id);

    const likedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
            [isLiked ? "$pull":"$push"]:{likes:req?.user?._id}
        },
        { new: true }
    )

    // VALIDATED COMMENT

    if(!likedComment){
        throw new ApiError(500,"Failed to like comment");
    }

    // RETURN RESPONSE

    return res.status(200).json(new ApiResponse(200, likedComment, isLiked ? "Comment disliked successfully" : "Comment liked successfully"));

} )