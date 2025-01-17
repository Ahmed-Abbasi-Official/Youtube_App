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

const refreshAcessToken=asyncHandler(async (req,res)=>{

    // GET REFRESH TOKEN FROM COOKIES 

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken ;

    if(!incomingRefreshToken){
        throw new ApiError(401 , "Unauthorized Requst") ;
    }

    //   DECODE TOKEN
    
      const decodeToken = jwt.verify(token, process.env.ACCEES_TOKEN_SECRET);

    //   FIND USER

    const user = await User.findById(decodeToken?._id) ;

    if(!user){
        throw new ApiError(401 , "Invalid refresh token")
    }

    // CHECK INCOMING AND HOLD REFRESH TOKEN 

    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401 , "Refresh Token is Expired")
    }

    // GENERATE NEW TOKENS

    const options = {
        http:true , 
        secure :true
    }

  const {accessToken , newRefreshToken} =  await generateAccessAndRefreshToken(user?._id) ;

    // RETURN RESPONSE 

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .jsono(
        new ApiResponse(
            200,
            { accessToken , refreshToken : newRefreshToken } , 
            "Acsess Token Refreshed Succesfully"
        )
    )
})

export { registerUser , loginUser , logoutUser , refreshAcessToken };
