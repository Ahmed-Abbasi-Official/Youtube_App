import { Router } from "express";
import {
    changePassword,
    dislikeVideo,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    likeVideo,
    loginUser,
    logoutUser,
    refreshAcessToken,
    registerUser,
    resendOTP,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    verifyEmail,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/isAuth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single('avatar'),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/me").get(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/user/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/verify-email").post( verifyEmail );
router.route("/resend-email").post( resendOTP );
router.route("/liked-video").post( verifyJWT , likeVideo );
router.route("/dis-liked-video").post( verifyJWT , dislikeVideo )

export default router;
