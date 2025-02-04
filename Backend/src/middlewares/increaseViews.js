import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";

const increaseVisits=async(req,res,next)=>{
    const slug=req.params.slug;

  const video = await Video.findOneAndUpdate({slug},{$inc:{views:1}})
  if(!video){
    throw new ApiError(400,'Video not found')  // or send a custom error message with status code 404 if you want to use a custom error class.
  }
  const user = req?.user?._id

  const his = await User.findOneAndUpdate(
    { _id: user}, // ✅ Only update if history is not paused
    { $push: { watchHistory: video._id } },
    { new: true }
  );
  

    next();
}

export default increaseVisits;