import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req , _ , next) => {

  // MAKE TOKEN FROM COOKIES

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  //   DECODE TOKEN

  const decodeToken = jwt.verify(token, process.env.ACCEES_TOKEN_SECRET);

  //  FIND USER

  const user = await User.findById(decodeToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid Acess Token");
  }

  //  RETURN USER IN REQ

  req.user = user;

  next() ;

});
