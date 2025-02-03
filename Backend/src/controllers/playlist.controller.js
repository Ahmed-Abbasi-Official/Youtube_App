import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🎯 CREATE NEW PLAYLIST

export const createPlaylist = asyncHandler( async (req,res)=>{

    // GET PLAYLIST NAME

    const { playlistName } = req.body;
    // console.log(req.body);

    // VALIDATION

    if(!playlistName){
        throw new ApiError('Playlist name is required');
    }

    // CREATE NEW PLAYLIST

    const newPlaylist = await Playlist.create({
        playlistName,
        user: req?.user?._id,
        playlistVideos:[]
    });

    if(!newPlaylist){
        throw new ApiError(500, 'Failed to create playlist');
    }

    // RETURN NEW PLAYLIST RESPONSE

    return res
       .status(201)
       .json(new ApiResponse(201, newPlaylist, 'Playlist created successfully'));

} )

// �� GET USER PLAYLISTS

export const getPlaylists = asyncHandler( async (req,res)=>{
    const playlists = await Playlist.find({user:req?.user?._id}).populate("playlistVideos");
    // console.log(playlists)
    if(!playlists){
        throw new ApiError(404, 'No Plalist Exist ');
    }
    return res
     .status(200)
     .json(new ApiResponse(200, playlists, 'Playlists fetched successfully'));
} )

// DELETE PLAYLISTS

export const deletePlaylist = asyncHandler( async (req,res)=>{
    const playlist = await Playlist.findByIdAndDelete(req?.params?.id);
    // console.log(playlist)
    if(!playlist){
        throw new ApiError(404, 'Playlist not found');
    }

    return res
     .status(200)
     .json(new ApiResponse(200, {}, 'Playlist deleted successfully'));
})

// ADD AND REMOVE VIDEO FROM PLAYLIST

export const togglePlaylist = asyncHandler( async(req,res)=>{

    // GET PLAYLIST FROM ID
    const {slug} = req.body ;

    const playlist = await Playlist.findById(req?.params?.id);
    if(!playlist){
        throw new ApiError(404, 'Playlist not found');
    }
    const video = await Video.findOne({slug})
    if(!video){
        throw new ApiError(404, 'Video not found');
    }

   await Video.findByIdAndUpdate(video?._id,{
    $set:{isChecked:!video.isChecked},
    
   },{new:true})

    const isCheckedPlaylist = playlist?.playlistVideos?.includes(video?._id);
    // console.log(isCheckedPlaylist)

    // ADD VIDEO TO PLAYLIST

    const updateQuery = isCheckedPlaylist
    ? {
        $pull: { playlistVideos: video?._id },
        $unset: { slug: "" }, // Remove slug when removing video
      }
    : {
        $push: { playlistVideos: video?._id },
        $set: { slug }, // Store latest added video's slug
      };

      const updatedPlaylist = await Playlist.findByIdAndUpdate(req?.params?.id, updateQuery, { new: true });

    // RETURN RESPONSE

    return res
       .status(200)
       .json(new ApiResponse(200, updatedPlaylist, isCheckedPlaylist? 'Video removed from playlist' : 'Video added to playlist'));

} )

// GET SINGLE PLAYLIST

export const getSinglePlaylist = asyncHandler(async (req,res)=>{
     const playlist = await Playlist.findById(req?.params?.id)
    .populate({
        path: "playlistVideos",
        options: { sort: { createdAt: -1 } }, // Sort playlistVideos by createdAt
        populate: {
            path: "owner"
        }
    });
    // console.log(playlist)
    if(!playlist){
        throw new ApiError(404, 'Playlist not found');
    }
    return res
     .status(200)
     .json(new ApiResponse(200, playlist, 'Playlist fetched successfully'));
} )

