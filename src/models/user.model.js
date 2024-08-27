import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
  {
    userName: {
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

userSchema.pre("save",async function (next) {
  if(!this.isModified) return next();
    this.password=bcrypt.hash(this.password,10)
    next()
})



export const User = mongoose.model("User", userSchema);