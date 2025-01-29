import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// UPLOAD VIDEO

export const uploadVideo = asyncHandler(async (req, res) => {
  // GET DATA FROM USER

  const { title, description, category, isPublic } = req.body;

  // CHECK VALIDATION FOR DATA

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new Error("All fields are required");
  }
  // CHECK FOR VIDEO

  const videoLocalPath = req.file?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "videoLocalPath file is required");
  }

  // UPLOAD CLOUDINARY

  const videoURL = await uploadCloudinary(videoLocalPath);

  // VALDATION CLOUDINARY VIDEO

  if (!videoURL) {
    throw new ApiError(400, "video file is required");
  }

  //  SLUG LOGIC

  let slug = req.body.title.replace(/ /g, "-").toLowerCase();
  let existSlug = await Video.findOne({ slug });
  let counter = 2;

  while (existSlug) {
    slug = `${slug}-${counter}`;
    existSlug = await Video.findOne({ slug });
    counter++;
  }
  console.log(slug);

  // CREATE THUMBNAI

  const thumbnailUrl = videoURL?.url
    .replace("/upload/", "/upload/so_1,w_600,c_fill/")
    .replace(".mp4", ".jpg");

  // CREATE NEW VIDEO DOCUMENT

  const video = await Video.create({
    title,
    description,
    category,
    slug,
    isPublic,
    thumbnail: thumbnailUrl,
    videoFile: videoURL?.url,
    owner: req?.user?._id,
    duration: videoURL?.duration,
  });

  if(!video){
    throw new ApiError(500, "Failed to create video");
  }

  // RETURN RSPONSE


  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

// GET ALL VIDEOS

export const getAllVideos = asyncHandler(async (req, res) => {
  // GET ALL VIDEOS

  const videos = await Video.find({isPublic: "public"}).sort({ createdAt: -1 }).populate('owner');

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// GET SINGLE VIDEO

export const getSingleVideo = asyncHandler(async (req, res) => {
  // GET SINGLE VIDEO

  const video = await Video.findOne({ slug: req?.params?.slug }).populate('owner');

  // CHECK VIDEO

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

// DELETE VIDEO

export const deleteVideo = asyncHandler(async (req, res) => {
  // GET SINGLE VIDEO

  const video = await Video.findById(req?.params?.id);

  // CHECK VIDEO

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // CHECK FOR THE OWNER

  if (String(video.owner) !== String(req?.user?._id)) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  // DELETE VIDEO

  await Video.findByIdAndDelete(req?.params?.id);

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// GET SELECTED USER VIDEOS

export const getVideosByUser = asyncHandler(async (req, res) => {
  // GET SELECTED USER VIDEOS
  const user = await User.findOne({ username: req?.params?.username }).sort({ createdAt: -1 });
  if(!user){
    throw new ApiError(404, "User not found");
  }

  // GET VIDEOS 

  const videos = await Video.find({ owner: user._id }).populate("owner");

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// UPDATE VIDEO

export const updateVideo = asyncHandler(async (req, res) => {
    // GET SINGLE VIDEO
    const video = await Video.findById(req?.params?.id);
  
    // CHECK VIDEO
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  
    // CHECK FOR THE OWNER
    if (String(video.owner) !== String(req?.user?._id)) {
      throw new ApiError(403, "You are not authorized to update this video");
    }
  
    // GET VIDEO FROM MULTER
    const videoLocalPath = req.file?.path;
  
    // UPLOAD CLOUDINARY (only if video file is provided)
    let updatedVideoURL;
    if (videoLocalPath) {
      const uploadResponse = await uploadCloudinary(videoLocalPath);
      
      // DELETE OLD VIDEO if new video is uploaded
      await cloudinary.uploader.destroy(video.videoFile);
      
      // Update the video file URL with the response URL
      updatedVideoURL = uploadResponse?.secure_url; // Access the URL from the response
    }
    
    // Generate new thumbnail URL only if video is updated
    const newUpdatedVideoURL = updatedVideoURL || video.videoFile;
    
    // Ensure newUpdatedVideoURL is a string before applying replace
    const thumbnailUrl = typeof newUpdatedVideoURL === "string"
      ? newUpdatedVideoURL.replace("/upload/", "/upload/so_1,w_600,c_fill/").replace(".mp4", ".jpg")
      : video.thumbnail; // fallback to existing thumbnail if video is not updated
    

  
    // UPDATE VIDEO
    const updatedVideo = await Video.findByIdAndUpdate(
      req?.params?.id,
      { 
        ...req.body, 
        videoFile: newUpdatedVideoURL || video.videoFile, // Ensure videoFile is updated only if a new file is provided
        thumbnail: thumbnailUrl
      },
      { new: true }
    );
  
    // RETURN RESPONSE
    return res
      .status(200)
      .json(
        new ApiResponse(
          200, 
          updatedVideo, 
          "Video updated successfully"
        )
      );
  });
  