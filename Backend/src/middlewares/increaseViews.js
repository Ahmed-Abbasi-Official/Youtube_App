import { Video } from "../models/video.model.js";

const increaseVisits=async(req,res,next)=>{
    const slug=req.params.slug;
    await Video.findOneAndUpdate({slug},{$inc:{views:1}})

    next();
}

export default increaseVisits;