import { sendVerificationCode } from "./sendVerificationCode.js";
import UserOTP from "../models/userOTP.model.js";
import { generateOTP } from "./generateOTP.js"
import { asyncHandler } from "./asyncHandler.js";
import { ApiResponse } from "./ApiResponse.js";

const sendEmail=asyncHandler(async({_id,email},res)=>{
    const otp = generateOTP()
    console.log("email",email,"id",_id);
    await UserOTP.create({
        userId: _id,
        otp: otp,
        expiresAt: new Date(Date.now() + 60 * 1000)
    })
  await sendVerificationCode(email,otp)

    return res
    .status(200)
    .json(
      new ApiResponse(200,"Verification Code Sent Successfully")
    )
})

export { sendEmail }