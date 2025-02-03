import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  playlistName: { type: String, required: true },
  playlistVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
  slug:{type:String},
},{timestamps:true});

export const Playlist = mongoose.model("Playlist", playlistSchema);
  