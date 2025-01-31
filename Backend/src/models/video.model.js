import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String, // Cloudinary URL
      required:true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // from Cloudinary Info
      required: true,
    },
    category: {
      type: String,
      // required:true,
      default: "general",
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: String,
      default: "public",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isChecked:{
      type: Boolean,
      default: false,
    },
    isSubscribed:{
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes:[
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes:[
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ]
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
