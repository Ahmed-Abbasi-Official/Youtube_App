import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from '../models/user.model.js'
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

    //  REGISTER USER

const registerUser=asyncHandler(async (req,res)=>{
    // GET DATA FROM USER

    const {email,fullName,username,password}=req.body;

    // VALIDATION - NOT EMPTY

    if(
        [email,fullName,username,password].some((filed)=>filed?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    // CHECK FOR (username and email) DUPLICATION

    const existedUser = await User.findOne({
        $or:[ { username } , { email } ]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }

    // CHECK FOR AVATAR
    const avatarLocalPath=req.files?.avatar[0]?.path ;
    const coverLocalPath=req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    // MULTER CHECK
    // UPLOAD CLOUDINARY
    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    // CREATE OBJECT
   const user = await User.create({
        fullName,
        email,
        avatar:avatar.url,
        coverImage:coverImage.url || "",
        password,
        username:username.toLowerCase()
    })
    // REMOVE PASSWORD and REFRESH TOKEN  RESPONSE 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // CHECK FOR USER CREATION
    if(!createdUser){
        throw new ApiError(500 , "Someting went wrong while registration the user")
    }
    // RETURN RESPONSE

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )

})

export {registerUser}