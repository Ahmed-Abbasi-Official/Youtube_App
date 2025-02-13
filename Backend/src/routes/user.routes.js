import { Router } from "express";
import {
    changePassword,
    deleteAllHistory,
    dislikeVideo,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    likeVideo,
    loginUser,
    logoutUser,
    refreshAcessToken,
    registerUser,
    removeVideoFromHistory,
    resendOTP,
    updateAccountDetails,
    updateUserAvatar,
    pauseHistory,
    updateUserCoverImage,
    verifyEmail,
    getSubscribersAndSubscribed,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/isAuth.middleware.js";
import increaseVisits from "../middlewares/increaseViews.js";

const router = Router();

router.route("/register").post(
    upload.single('avatar'),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post( logoutUser);
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
router.route("/community").get(verifyJWT, getSubscribersAndSubscribed);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/history/:videoId").delete(verifyJWT, removeVideoFromHistory);
router.route("/history/all").get(verifyJWT, deleteAllHistory);
// router.route("/history/pause").patch( increaseVisits , verifyJWT, pauseHistory);
router.route("/verify-email").post( verifyEmail );
router.route("/resend-email").post( resendOTP );
router.route("/liked-video").post( verifyJWT , likeVideo );
router.route("/dis-liked-video").post( verifyJWT , dislikeVideo )

export default router;
