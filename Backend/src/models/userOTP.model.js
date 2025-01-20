import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userOTP = new Schema({
    userId: {
        type: String,
        required: true,
    },
    otp: { type: String },
    expiresAt: { type: Date },
}, { timestamps: true });

userOTP.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

const UserOTP = model("UserOTP", userOTP);

export default UserOTP;