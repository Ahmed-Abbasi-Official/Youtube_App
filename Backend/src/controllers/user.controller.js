import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendMail.js";
import UserOTP from "../models/userOTP.model.js";
import bcrypt from "bcryptjs";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";

// TOKENS

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "SomeTHing went wrong while generating access and refresh token"
    );
  }
};

//  REGISTER USER

const registerUser = asyncHandler(async (req, res) => {
  // GET DATA FROM USER

  const { email, fullName, username, password } = req.body;
  // console.log(email);

  // VALIDATION - NOT EMPTY

  if (
    [email, fullName, username, password].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // CHECK FOR (username and email) DUPLICATION

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // CHECK FOR AVATAR
  // console.log(req.file)
  const avatarLocalPath=req.file?.path ;

  if(!avatarLocalPath){
      throw new ApiError(400,"AvatarLocal file is required")
  }
  // MULTER CHECK
  // UPLOAD CLOUDINARY
  const avatar = await uploadCloudinary(avatarLocalPath)

  if(!avatar){
      throw new ApiError(400,"Avatar file is required")
  }
  // CREATE OBJECT
  const user = await User.create({
    fullName,
    email,
    avatar: avatar.url,
    password,
    username: username,
  });
  // REMOVE PASSWORD and REFRESH TOKEN  RESPONSE
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  
  // CHECK FOR USER CREATION
  if (!createdUser) {
    throw new ApiError(500, "Someting went wrong while registration the user");
  }
  // SEND EMAIL
  await sendEmail({ _id: createdUser._id, email: createdUser.email }, res);
  // RETURN RESPONSE

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Verification Code Sent Successfully"));
});

// LOGIN USER

const loginUser = asyncHandler(async (req, res) => {
  // GET DATA FROM USER

  const { email, username, password } = req.body;

  // VALIDATION - NOT EMYPTY

  if ([email, username].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "username and email is required");
  }

  // FIND

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  // CHECK PASSWORD

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "User does not exists");
  }

  // ACCESS AND REFRESH TOKEN

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // GENERATES COOKIES

  const options = {
    httpOnly: true, // Cookie can't be accessed via JavaScript
    secure: true, // Only set to true in production (use HTTPS)
    sameSite: 'none', // Ensure it works with cross-site cookies
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User LoggedIn Successfully"
      )
    );
});

// LOGOUT USER

const logoutUser = asyncHandler(async (req, res) => {
  // FIND AND UPDATE

  await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite:"none"
  };

  //   RETURN RESPONSE

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

// REFRESH TOKEN  

const refreshAcessToken = asyncHandler(async (req, res) => {
  // GET REFRESH TOKEN FROM COOKIES

  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Requst");
  }

  //   DECODE TOKEN

  const decodeToken = jwt.verify(token, process.env.ACCEES_TOKEN_SECRET);

  //   FIND USER

  const user = await User.findById(decodeToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // CHECK INCOMING AND HOLD REFRESH TOKEN

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh Token is Expired");
  }

  // GENERATE NEW TOKENS

  const options = {
    http: true,
    secure: true,
    sameSite: 'none', // Ensure it works with cross-site cookies
  };

  const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  // RETURN RESPONSE

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .jsono(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Acsess Token Refreshed Succesfully"
      )
    );
});

// CHANGE PASSWORD  

const changePassword = asyncHandler(async (req, res) => {
  // GET NEW AND OLD PASSWORD

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All Required");
  }

  // GET CURRENT USER

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError("No User Found");
  }

  // CHECK OLD PSWRD

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  // REPLACE OLD TO NEW PSWRD

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Successfully Changed"));
});

// GET CURRENT USER 

const getCurrentUser = asyncHandler(async (req, res) => {
  // RETURN RESPONSE
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "User Details Retrieved Successfully"
    )
  );
});

// UPDATE USER EMAIL AND PASSWORD

const updateAccountDetails = asyncHandler(async (req, res) => {
  // GET UPDATED DETAILS FRON USER

  const { username, fullName } = req.body;

  if (!username || !fullName) {
    throw new ApiError(400, "All fields are required");
  }

   // CHECK FOR (username and email) DUPLICATION

   const existedUser = await User.findOne({
    $or: [ { username } ],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username already exists");
  }

  // FIND CURRENT USER AND UPDATE
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        username,
      },
    },
    { new: true } // return updated user
  ).select("-password");
  
  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Succesfully"));
});

// UPDATE AVATAR

const updateUserAvatar = asyncHandler(async (req, res) => {
  //  GET NEW AVATAR FROM USER

  const avatarLoacalPath = req.file?.path;

  // CEHCK FOR THE LOCAL AVATAR

  if (!avatarLoacalPath) {
    throw new ApiError(400, "Avatar file is misssing");
  }

  // UPLOAD ON CLOUDINARY

  const avatar = await uploadCloudinary(avatarLoacalPath);

  // CHECK FOR AVATAR

  if (!avatar) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  // FIND AND UPDATE CURRENT USER AVATAR

  const user = await User.findOneAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image Updated Succesfully"));
});

// UPDATE COVER IMAGE

const updateUserCoverImage = asyncHandler(async (req, res) => {
  //  GET NEW COVER IMAGE FROM USER

  const coverImageLoacalPath = req.file?.path;

  // CEHCK FOR THE LOCAL COVER IMAGE

  if (!coverImageLoacalPath) {
    throw new ApiError(400, "Cover Image file is misssing");
  }

  // UPLOAD ON CLOUDINARY

  const coverImage = await uploadCloudinary(coverImageLoacalPath);

  // CHECK FOR Cover Image

  if (!coverImage) {
    throw new ApiError(400, "Error while uploading on Cover Image");
  }

  // FIND AND UPDATE CURRENT USER COVER IMAGE

  const user = await User.findOneAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password");

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image Updated Succesfully"));
});

// GET CHANNEL PROFILE

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username:username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

// GET WATCH HISTORY

const getWatchHistory = asyncHandler(async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: { $first: "$owner" },
              },
            },
            {
              $sort: { createdAt: -1 }, // Sorting watchHistory inside lookup
            },
          ],
        },
      },
    ]);

    if (!user.length) {
      console.log("User not found or no watch history.");
      return res.status(404).json(new ApiResponse(404, [], "User not found or no watch history."));
    }

    // console.log("Watch History Data:", user[0].watchHistory);

    return res.status(200).json(
      new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching watch history:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

// REMOVE VIDEO FROM HISTORY

const removeVideoFromHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is missing");
  }
   
 const user = await User.findByIdAndUpdate(
    req?.user?._id,
    { $pull: { watchHistory: videoId } },
    { new: true } // ✅ Correct placement
  );

  if(!user){
    throw new ApiError(404, null, "User not found");
  }

  // RETURN RESPONSE

  return res
   .status(200)
   .json(new ApiResponse(200, {}, "Video removed from watch history successfully"));
  

})

// DELETE ALL HISTORY

const deleteAllHistory = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { watchHistory: [] } },
      { new: true } // ✅ Correct placement
    );

    if (!user) {
      throw new ApiError(404, null, "User not found");
    }

    // RETURN RESPONSE

    return res
     .status(200)
     .json(new ApiResponse(200, {}, "All watch history removed successfully"));
  } catch (error) {
    console.error("Error deleting all history:", error);
    return res.status(500).json(new ApiResponse(500, error, "Internal Server Error"));
  }
});

// PAUSE HISTORY

const pauseHistory = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { isHistoryPaused: true } },
      { new: true } // ✅ Correct placement
    );

    if (!user) {
      throw new ApiError(404, null, "User not found");
    }

    // RETURN RESPONSE

    return res
     .status(200)
     .json(new ApiResponse(200, {}, "Watch history paused successfully"));
  } catch (error) {
    console.error("Error pausing watch history:", error);
    return res.status(500).json(new ApiResponse(500, error, "Internal Server Error"));
  }
});

// VERIFT OTP

const verifyEmail = asyncHandler(async (req, res) => {

  // GET OTP AND USER ID FROM USER

  const { otp, userId } = req.body;
  // console.log(otp,userId)

  // CHECK FOR USER ID AND OTP

  if (!userId || !otp) {
    throw Error("Empty otp details are not allowed");
  } else {
    // FIND OTP AND USER 
    const verificationResponse = await UserOTP.find({
      userId,
    });
    // console.log(verificationResponse);
    // CHECK FOR OTP AND USER
    if (verificationResponse.length <= 0) {
      throw Error(
        "Account record does'nt exit or has been verified already. Please log in."
      );
    } else {
      const { expiresAt } = verificationResponse[0];  

      const hashedOTP = verificationResponse[0].otp;

      if (expiresAt < Date.now()) {
        await UserOTP.deleteMany({ userId });

        throw new Error("Code has expired. Please request again.");
      } else {
        const isOTPMatched = await bcrypt.compare( otp , hashedOTP );
        if (!isOTPMatched) {
          throw new Error( "Invalid OTP. Please try again." );
        } else {
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true }
          );
          await UserOTP.deleteMany({ userId });

          res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            // // role: updatedUser.role,
            // userImg: updatedUser.img,
            // title: updatedUser.title,
            isVerified: updatedUser.isVerified,
          });
        }
      }
    }
  }
});

// RESEND OTP

const resendOTP = asyncHandler( async (req, res) => {
  // GET USER ID AND EMAIL FROM USER
  const {  userId, email } = req.body;
    // console.log("Resend Email",email);

    if (!userId || !email) {
        throw Error("Empty user details are not allowed");
    } else {
        await UserOTP.deleteMany({ userId });

        await sendEmail({ _id: userId , email }, res);
        res.status(200).json(new ApiResponse(
          200,
          {}
          ,
          "Verification code has been sent to your registered email.",
        ))
    }
});

// LIKED VIDEOS

const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video ID is missing");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if video is already liked
  const isLiked = user.likedVideos.includes(videoId);

  // Update user's likedVideos array

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      [isLiked ? "$pull" : "$push"]: { likedVideos: videoId }, // Pull if liked, Push if not
    },
    { new: true }
  ).select("-password");

  if(!updatedUser){
    throw new ApiError(500, "Failed to update user's likedVideos array");  // Handle error in case user is not found or updatedUser is null.
  }

  // Check if video is already in user's likedVideos array

  const video = await Video.findById(videoId);
  // CHECK LIKES IN VIDEO MODEL
  const checkLikedVideo = video.likes.includes(req.user._id)
  // ADD USER IN VIDEO MODEL
  const addUserInVideo = await Video.findByIdAndUpdate(videoId,{
    [checkLikedVideo ? "$pull"  : "$push"] : {likes:req.user._id}
  })
  // VALIDATION FOR ADDUSERINVIDEO
  if(!addUserInVideo){
    throw new ApiError(500, "Failed to update video's likes array");  // Handle error in case user is not found or updatedUser is null.
  }


  // Return response

  return res.status(200).json(
    new ApiResponse(200, updatedUser, isLiked ? "Video Unliked Successfully" : "Video Liked Successfully")
  );
});

// DISLIKED VIDEOS

const dislikeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  // console.log(videoId)
  
  if (!videoId) {
    throw new ApiError(400, "Video ID is missing");
  }
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // console.log(user)
  
  // Check if video is already disliked
  const isDisliked = user.disLikedVideos.includes(videoId);
  // console.log(isDisliked)
  
  // Update user's dislikedVideos array
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      [isDisliked ? "$pull" : "$push"]: { disLikedVideos: videoId }, // Pull if disliked, Push if not
    },
    { new: true }
  ).select("-password");

  if(!updatedUser){
    throw new ApiError(500, "Failed to update user's dislikedVideos array");  // Handle error in case user is not found or updatedUser is null.
  }

  // Check if video is already in user's likedVideos array

  const video = await Video.findById(videoId);
  // CHECK LIKES IN VIDEO MODEL
  const checkDisLikedVideo = video.disLikes.includes(req.user._id)
  // ADD USER IN VIDEO MODEL
  const addUserInVideo = await Video.findByIdAndUpdate(videoId,{
    [checkDisLikedVideo ? "$pull"  : "$push"] : {disLikes:req.user._id}
  })
  // VALIDATION FOR ADDUSERINVIDEO
  if(!addUserInVideo){
    throw new ApiError(500, "Failed to update video's likes array");  // Handle error in case user is not found or updatedUser is null.
  }

  // console.log(updatedUser)

  // Return response
  
  return res.status(200).json(
    new ApiResponse(200, updatedUser, isDisliked ? "Video Undisliked Successfully" : "Video Disliked Successfully")
  );

})

// GET ALL SUBSCRIBER AND SUBSRIBED

const getSubscribersAndSubscribed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Find all users who subscribed to this user (subscribers)
  const subscribers = await Subscription.find({ channel: userId })
    .populate("subscriber") // ✅ Populates full subscriber details

  // Find all users this user has subscribed to (subscribed)
  const subscribed = await Subscription.find({ subscriber: userId })
    .populate("channel subscriber") // ✅ Populates full subscribed user details

  return res.status(200).json(
    new ApiResponse(200, { subscribers, subscribed },"Fetch data Successfully")
  );
});



export {

  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  verifyEmail,
  resendOTP,
  likeVideo,
  dislikeVideo,
  removeVideoFromHistory,
  deleteAllHistory,
  pauseHistory,
  getSubscribersAndSubscribed

};