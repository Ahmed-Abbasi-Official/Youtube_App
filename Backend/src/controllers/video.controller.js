import { Subscription } from "../models/subscription.model.js";
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

  // CHECK FOR VIDEO FILE
  const videoLocalPath = req.files?.video?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  // UPLOAD VIDEO TO CLOUDINARY
  const videoURL = await uploadCloudinary(videoLocalPath);

  // VALIDATE VIDEO UPLOAD
  if (!videoURL) {
    throw new ApiError(400, "Failed to upload video");
  }

  // SLUG LOGIC
  let slug = req.body.title.replace(/ /g, "-").toLowerCase();
  let existSlug = await Video.findOne({ slug });
  let counter = 2;
  while (existSlug) {
    slug = `${slug}-${counter}`;
    existSlug = await Video.findOne({ slug });
    counter++;
  }

  console.log(slug);

  // CHECK FOR USER-DEFINED THUMBNAIL
  let thumbnailUrl;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (thumbnailLocalPath) {
    // Agar user ne thumbnail diya hai toh upload karo
    const uploadedThumbnail = await uploadCloudinary(thumbnailLocalPath);
    if (!uploadedThumbnail) {
      throw new ApiError(400, "Failed to upload thumbnail");
    }
    thumbnailUrl = uploadedThumbnail.url;
  } else {
    // Agar user ne thumbnail nahi diya toh Cloudinary ka auto-generated thumbnail lo
    thumbnailUrl = videoURL?.url
      .replace("/upload/", "/upload/so_1,w_600,c_fill/")
      .replace(".mp4", ".jpg");
  }

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

  if (!video) {
    throw new ApiError(500, "Failed to create video");
  }

  // RETURN RESPONSE
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});


// GET ALL VIDEOS

export const getAllVideos = asyncHandler(async (req, res) => {
  // GET ALL VIDEOS

  const videos = await Video.find({ isPublic: "public" })
    .sort({ createdAt: -1 })
    .populate("owner");

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// GET SINGLE VIDEO

export const getSingleVideo = asyncHandler(async (req, res) => {
  const video = await Video.findOne({ slug: req?.params?.slug }).populate(
    "owner"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  let isSubscribed = false;

  if (req.user) {
    const subscription = await Subscription.findOne({
      subscriber: req.user._id,
      channel: video.owner._id,
    });
    // console.log(subscription)

    isSubscribed = !!subscription;
  }

  // Update Video model's isSubscribed field (if subscribed)
  if (isSubscribed) {
    await Video.findByIdAndUpdate(video._id, { isSubscribed: true });
  } else {
    await Video.findByIdAndUpdate(video._id, { isSubscribed: false });
  }

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
  const user = await User.findOne({ username: req?.params?.username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // GET SORT QUERY
  const { sort } = req.query; // Get sort query parameter (newest or oldest)
  let sortOption = { createdAt: -1 }; // Default newest

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  // GET VIDEOS WITH SORTING
  const videos = await Video.find({ owner: user._id })
    .sort(sortOption)
    .populate("owner");

  // RETURN RESPONSE
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// UPDATE VIDEO

export const updateVideo = asyncHandler(async (req, res) => {
  // GET SINGLE VIDEO
  // console.log(req.body)
  const video = await Video.findById(req?.params?.id);
  // CHECK VIDEO
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  // console.log(video)

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


  // UPDATE VIDEO
  const updatedVideo = await Video.findByIdAndUpdate(
    req?.params?.id,
    {
      title: req.body.title || video?.title,
      description: req.body.description || video?.description,
      category: req.body.category || video?.category,
      slug: video?.slug,
      isPublic: req.body.isPublic || video?.isPublic,
      videoFile: newUpdatedVideoURL || video.videoFile, // Ensure videoFile is updated only if a new file is provided
    },
    { new: true }
  );
  // console.log(updateVideo)

  // RETURN RESPONSE
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

// DASHBOARD DATA

export const dashboardData = asyncHandler(async (req, res) => {
  const channel = await User.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        totalViews: { $sum: "$videos.views" },
        totalLikes: {
          $sum: {
            $map: {
              input: "$videos",
              as: "video",
              in: { $size: "$$video.likes" }, // Sum of likes from owned videos
            },
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        totalViews: 1,
        totalLikes: 1, // Now correctly calculated
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "Dashboard Data fetched successfully")
    );
});

// TOGGLE SUBSCRIPTION

export const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  const ownerVideo = await Video.findById(channelId);

  if (userId.toString() === ownerVideo?.owner.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: ownerVideo?.owner,
  });

  if (existingSubscription) {
    // Unsubscribe (Remove subscription)
    const unSubs = await Subscription.findByIdAndDelete(
      existingSubscription._id
    );

    if (!unSubs) {
      throw new ApiError(500, "Failed to unsubscribe from channel"); // Handle error if failed to delete subscription. 500 means server error.
    }

    const UnsubscribedVideo = await Video.findOneAndUpdate(
      { _id: channelId }, // Find a video where the owner matches
      { isSubscribed: false }, // Update field
      { new: true } // Return updated document
    );

    if (!UnsubscribedVideo) {
      throw new ApiError(500, "Failed to UnsubscribedVideo to channel");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, unSubs, "Unsubscribed successfully"));
  } else {
    // Subscribe (Create new subscription)
    await Subscription.create({
      subscriber: userId,
      channel: ownerVideo?.owner,
    });

    const subscribedVideo = await Video.findOneAndUpdate(
      { _id: channelId }, // Find a video where the owner matches
      { isSubscribed: true }, // Update field
      { new: true } // Return updated document
    );

    if (!subscribedVideo) {
      throw new ApiError(500, "Failed to subscribe to channel");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subscribedVideo, "Subscribed successfully"));
  }
});

// UNSUBS

export const unsubs = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req?.user?._id;

  // Remove Subscription Entry
  const unsubs = await Subscription.findOneAndDelete({
    subscriber: userId,
    channel: channelId,
  });

  if (!unsubs) {
    throw new ApiError(500, "Failed to unsubscribe from channel");
  }

  // Update videos where owner is the unsubscribed channel
  const isSub = await Video.updateMany(
    { owner: channelId },
    { $set: { isSubscribed: false } }
  );

  if (isSub.nModified === 0) {
    throw new ApiError(500, "Failed to update videos");
  }

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
});

// SUBS

export const subs = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req?.user?._id;

  // Add Subscription Entry
  await Subscription.create({
    subscriber: userId,
    channel: channelId,
  });

  // Update videos where owner is the subscribed channel
  const isSub = await Video.updateMany(
    { owner: channelId },
    { $set: { isSubscribed: true } }
  );

  if (isSub.nModified === 0) {
    throw new ApiError(500, "Failed to update videos");
  }

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subscribed successfully"));
});

// LIKED VIDEOS

export const userLikedVideo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // console.log(req.user)
  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }
  const videos = await User.findById(req.user._id).populate({
    path: "likedVideos", // Populates likedVideos
    populate: {
      path: "owner", // Populates the owner field within each liked video
    },
  });

  // console.log(videos)
  if (!videos) {
    throw new ApiError(404, "User Not Found");
  }

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos fetched successfully"));
});

// SEARCH ON EVERY QUERY

export const searchVideos = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const videos = await Video.find({
    title: { $regex: q, $options: "i" },
  }).limit(10);

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// GET VIDEOS BY CAT

export const getVideosByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  // Pehle 6 videos specified category ki fetch karo
  let categoryVideos = await Video.find({ category })
    .limit(6)
    .populate("owner");

  // Agar 6 se kam videos milein toh remaining count calculate karo
  const remainingCount = 6 - categoryVideos.length;

  // Remaining videos kisi bhi category se le aao (except given category)
  let otherVideos = [];
  if (remainingCount > 0) {
    otherVideos = await Video.find({ category: { $ne: category } })
      .limit(remainingCount)
      .populate("owner");
  }

  // Ab mix videos fetch karo (except jo pehle le chuke hain)
  let mixedVideos = await Video.find({
    _id: {
      $nin: [
        ...categoryVideos.map((v) => v._id),
        ...otherVideos.map((v) => v._id),
      ],
    },
  })
    .limit(10)
    .populate("owner");

  // Final response
  const allVideos = [...categoryVideos, ...otherVideos, ...mixedVideos];

  // RETURN RESPONSE
  return res
    .status(200)
    .json(new ApiResponse(200, allVideos, "Videos fetched successfully"));
});
