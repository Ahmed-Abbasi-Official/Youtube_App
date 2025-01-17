import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  // const avatarLocalPath=req.files?.avatar[0]?.path ;
  // const coverLocalPath=req.files?.coverImage[0]?.path

  // if(!avatarLocalPath){
  //     throw new ApiError(400,"Avatar file is required")
  // }
  // MULTER CHECK
  // UPLOAD CLOUDINARY
  // const avatar = await uploadCloudinary(avatarLocalPath)
  // const coverImage = await uploadCloudinary(coverLocalPath)

  // if(!avatar){
  //     throw new ApiError(400,"Avatar file is required")
  // }
  // CREATE OBJECT
  const user = await User.create({
    fullName,
    email,
    // avatar:avatar.url,
    // coverImage:coverImage.url || "",
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
  // RETURN RESPONSE

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
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
    http: true,
    secure: true,
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
    http: true,
    secure: true,
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

  return res.status(200).json(200, req.user, "User Fetched Successfully");

});

// UPDATE USER EMAIL AND PASSWORD 

const updateAccountDetails = asyncHandler(async (req,res)=>{

    // GET UPDATED DETAILS FRON USER

    const { email , fullName } = req.body ;

    if(!email || !fullName){
        throw new ApiError(400 , "All fields are required")
    }

    // FIND CURRENT USER AND UPDATE

    const user = await User.findByIdAndUpdate(
        req.user?._id , 
        {
            $set:{
                fullName,
                email
            }
        } ,
        { new:true } // return updated user
    ).select("-password")

    // RETURN RESPONSE

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            user ,
            "Account Details Updated Succesfully"
        )
    )
})

// UPDATE AVATAR

const updateUserAvatar = asyncHandler(async (req,res)=>{

    //  GET NEW AVATAR FROM USER

    const avatarLoacalPath = req.files?.path ;

    // CEHCK FOR THE LOCAL AVATAR 

    if(!avatarLoacalPath){
        throw new ApiError(400 , "Avatar file is misssing") ;
    }

    // UPLOAD ON CLOUDINARY 

    const avatar = await uploadCloudinary(avatarLoacalPath) ;

    // CHECK FOR AVATAR

    if(!avatar){
        throw new ApiError(400 , "Error while uploading on avatar")
    }

    // FIND AND UPDATE CURRENT USER AVATAR

    const user =  await User.findOneAndUpdate(
        req.user?._id ,
        {
            $set:{avatar : avatar.url}
        } ,
        { new : true }
    ).select("-password")

    // RETURN RESPONSE

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            user ,
            "Avatar Image Updated Succesfully"
        )
    )

})

// UPDATE COVER IMAGE

const updateUserCoverImage = asyncHandler(async (req,res)=>{

    //  GET NEW COVER IMAGE FROM USER

    const coverImageLoacalPath = req.files?.path ;

    // CEHCK FOR THE LOCAL COVER IMAGE 

    if(!coverImageLoacalPath){
        throw new ApiError(400 , "Cover Image file is misssing") ;
    }

    // UPLOAD ON CLOUDINARY 

    const coverImage = await uploadCloudinary(coverImageLoacalPath) ;

    // CHECK FOR Cover Image

    if(!coverImage){
        throw new ApiError(400 , "Error while uploading on Cover Image")
    }

    // FIND AND UPDATE CURRENT USER COVER IMAGE

   const user = await User.findOneAndUpdate(
        req.user?._id ,
        {
            $set:{coverImage : coverImage.url}
        } ,
        { new : true }
    ).select("-password")

    // RETURN RESPONSE

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            user ,
            "Cover Image Updated Succesfully"
        )
    )

})

// GET CHANNEL PROFILE

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
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
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

// GET WATCH HISTORY

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
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
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})


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
  getWatchHistory

};
