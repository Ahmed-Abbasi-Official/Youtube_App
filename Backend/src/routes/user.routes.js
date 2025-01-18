import { Router } from "express";
import {
    changePassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAcessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/isAuth.middleware.js";

const router = Router();

router.route("/register").post(
  //   upload.fields([
  //     {
  //       name: "avatar",
  //       maxCount: 1,
  //     },
  //     {
  //       name: "coverImage",
  //       maxCount: 1,
  //     },
  //   ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/").get(getCurrentUser);
router.route("/update-account").patch(updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
