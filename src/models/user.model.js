import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // for enabling the searching field we use (index) .
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true, // for enabling the searching field we use (index) .
    },
    avatar: {
      type: String, // Cloundinary URL
      required: true,
    },
    coverImage: {
      type: String, // Cloundinary URL
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save",async function(next) {
  if(!this.isModified("password")) return next();
  await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect=async(pswrd){
 return await bcrypt.compare(pswrd,this.password)
}

userSchema.methods.generateAccessToken=function(){
 return  jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username,
    fullName:this.fullName
  },
  process.env.ACCEES_TOKEN_SECRET,
  {
    expiresIn:process.env.ACCEES_TOKEN_EXPIRY
  }
)
}
userSchema.methods.generateRefreshToken=function(){
 return  jwt.sign({
    _id:this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)
}

export const User = mongoose.model("User", userSchema);
