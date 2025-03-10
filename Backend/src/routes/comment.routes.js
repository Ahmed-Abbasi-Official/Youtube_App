import { Router } from "express";
import { createComment, deleteComment, getCommentsForVideo, likeComment, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/isAuth.middleware.js";

const router = Router();

// CREATE COMMENT
router.route('/create-comment').post( verifyJWT , createComment )

// GET COMMENT FOR VIDEO
router.route('/:id').get(getCommentsForVideo)

// DELETE COMMENT
router.route('/comment-delete/:id').delete(deleteComment)

// UPDATE COMMENT
router.route('/comment-update/:id').patch(updateComment)

// LIKES COMMENT
router.route('/like-comment/:id').patch( verifyJWT , likeComment );

export default router;
