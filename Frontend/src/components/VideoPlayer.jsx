import { useState, useRef, useEffect } from "react";
import HomeCard from "./HomeCard";
import { IoMdThumbsUp } from "react-icons/io";
import {
  ThumbsDown,
  ThumbsUp,
  MoreVertical,
  BookmarkIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smile,
} from "lucide-react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useUser } from "../context/User.Context";
import { toast } from "react-toastify";
import { MdThumbDownAlt } from "react-icons/md";
import millify from "millify";
import SaveModal from "./SaveModal";
import EditAndDeleteModal from "./EditAndDeleteModal";
import { useVideo } from "../context/Videos.Context";
import EmojiPicker from "emoji-picker-react";
import Comment from "./Comment";
import { useComments } from "../context/Comment.Context";
import Avatar from 'react-avatar';
import { useQuery } from "@tanstack/react-query";

function VideoPlayer({ video }) {
  const { likedVideos, dislikedVideos, user } = useUser();
  const { createComment } = useComments();
  const { getComments } = useComments();
  const { toggleSubscription } = useVideo();
  // GET ALL COMMENTS
  const {
    data: commentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      return await getComments(video?._id);
    },
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [savedModal, setSavedModal] = useState(false);
  const [showEditAndDeleteModals, setShowEditAndDeleteModals] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likedVideo, setLikedVideo] = useState(false);
  const [unLikedVideo, setUnLikedVideo] = useState(false);
  const [showCommentIcons, setShowCommentIcons] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    // videoRef.current.play()
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
    if (video?.likes.includes(user?.message?._id)) {
      setLikedVideo(true);
    }
    if (video?.disLikes.includes(user?.message?._id)) {
      setUnLikedVideo(true);
    }
  }, [videoRef]); // Updated dependency

  useEffect(() => {}, [selectedEmoji]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleProgress = (e) => {
    const progress = e.nativeEvent.offsetX / e.target.offsetWidth;
    videoRef.current.currentTime = progress * duration;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // HANDLE LIKED VIDEO

  const handleVideoLiked = async () => {
    setLikedVideo((prev) => !prev);
    await likedVideos.mutate(video, {
      onSuccess: (data) => {
        if (data?.data === "Video Liked Successfully") {
          setLikedVideo(true);
        } else {
          setLikedVideo(false);
        }
        toast.success(data?.data);
      },
      onError: (error) => {
        console.log(error);
        setLikedVideo(false);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  // HANDLE DIS LIKED VIDEO

  const handledisVideoLiked = async () => {
    setUnLikedVideo((prev) => !prev);
    await dislikedVideos.mutate(video, {
      onSuccess: (data) => {
        if (data?.data === "Video Disliked Successfully") {
          setUnLikedVideo(true);
        } else {
          setUnLikedVideo(false);
        }
        toast.success(data?.data);
      },
      onError: (error) => {
        console.log(error);
        setUnLikedVideo(false);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  // console.log(video)

  const handelDots = () => {
    setShowEditAndDeleteModals((prev) => !prev);
  };

  // SUBSCRIBED TOGGLED

  const handleToggleSubscribed = async () => {
    await toggleSubscription.mutate(
      { videoId: video?._id },
      {
        onSuccess: (data) => {
          if (data?.data === "Subscribed Successfully") {
            toast.success(data?.data);
          } else {
            toast.success(data?.data);
          }
        },
        onError: (error) => {
          console.log(error);
          toast.error(error?.response?.data?.message);
        },
      }
    );
  };

  // COMMENT AND EMOJI HANDLER

  const handleEmojiClick = (emojiObject) => {
    setComment((prev) => prev + emojiObject?.emoji);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
    // console.log(comment)
  };

  // CREATE COMMENT

  const handleCreateComment = async () => {
    const data = {
      comment,
      videoId: video?._id,
    };

    await createComment.mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        setComment("");
        toast.success(data?.data);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-black text-white min-h-screen">
        {/* Main content */}

        <div className="flex-1 space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden w-full">
            <video
              ref={videoRef}
              src={video?.videoFile}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current.duration)}
              muted={isMuted}
              playsInline
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              onClick={togglePlay}
            >
              {!isPlaying && (
                <button className="h-16 w-16 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-sm">
                  <Play className="h-8 w-8 text-white ml-1" />
                </button>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div
                className="bg-white/10 h-1 rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgress}
              >
                <div
                  className="bg-white h-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay}>
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  <button onClick={toggleMute}>
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {video?.title || "Lex Fridman plays Red Dead Redemption 2"}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{video?.views || "109,067"} Views</span>
                <span>•</span>
                <span>{format(video?.createdAt) || "18 hours ago"}</span>
              </div>
            </div>
            {/* ICONS */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-full bg-gray-800">
                <button
                  onClick={handleVideoLiked}
                  className="flex items-center px-3 py-1 rounded-l-full text-white hover:bg-gray-700"
                >
                  {likedVideo ? (
                    <>
                      <IoMdThumbsUp className="h-5 w-5 mr-2 " />
                      <span className="text-sm">
                        {millify(video?.likes?.length)}
                      </span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="h-5 w-5 mr-2 " />
                      <span className="text-sm">
                        {millify(video?.likes?.length)}
                      </span>
                    </>
                  )}
                  {/* <ThumbsUp className="h-4 w-4 mr-2  " /> */}
                </button>
                <div className="w-px h-4 bg-gray-700 relative" />
                <button
                  onClick={handledisVideoLiked}
                  className="flex items-center px-3 py-1 rounded-r-full text-white hover:bg-gray-700"
                >
                  {unLikedVideo ? (
                    <>
                      <MdThumbDownAlt className="h-5 w-5 mr-2 " />
                      <span className="text-sm">
                        {millify(video?.disLikes?.length)}
                      </span>
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="h-5 w-5 mr-2 " />
                      <span className="text-sm">
                        {millify(video?.disLikes?.length)}
                      </span>
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={() => {
                  setSavedModal(true);
                }}
                className="flex items-center px-3 py-1 rounded-full text-white border border-gray-700 hover:bg-gray-800"
              >
                <BookmarkIcon className="h-5 w-5 mr-2" />
                Save
              </button>
              <div className="relative">
                <button
                  onClick={handelDots}
                  className="p-1 text-white rounded-full hover:bg-gray-800 "
                >
                  <MoreVertical className="h-5 w-5 mr-2 " />
                </button>
                {showEditAndDeleteModals && (
                  <EditAndDeleteModal
                    onClose={setShowEditAndDeleteModals}
                    video={video}
                  />
                )}
              </div>
            </div>
          </div>

          {/* USER INFO */}

          <div className="flex  items-center gap-4">
            <div className="flex justify-start items-center gap-4">
              <Link to={`/${video?.owner?.username}`}>
                <img
                  src={video?.owner?.avatar || ""}
                  className="md:w-12 md:h-12 w-12 h-12 sm:w-12 sm:h-12 bg-cover rounded-full"
                />
              </Link>
              <Link to={`/${video?.owner?.username}`}>
                <div>
                  <h1 className="text-xs sm:text-sm text-gray-300 font-bold ">
                    {video?.owner?.fullName || "Full Name"}
                  </h1>
                  <p className="text-sm  md:text-start text-gray-400">
                    {`@${video?.owner?.username}` || "User"}
                  </p>
                </div>
              </Link>
            </div>
            <button
              onClick={
                // video?.isSubscribed
                // handleUnSubscribed
                handleToggleSubscribed
              }
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg flex items-center space-x-2"
            >
              <span className="text-xs sm:text-md">
                {toggleSubscription?.isPending
                  ? "waiting..."
                  : video?.isSubscribed
                  ? "Unsubscribe"
                  : "Subscribe"}
              </span>
            </button>
          </div>

          {/* Comments */}

          <div className="space-y-4">
            <h3 className="font-semibold">
              {millify(commentData?.message?.length) || 5034} Comments
            </h3>
            <div className="flex items-center justify-center gap-4">
              {/* <img
                src={video?.owner?.avatar || ""}
                className="md:w-12 md:h-12 w-10 h-10 sm:w-10 sm:h-10 bg-cover rounded-full"
              /> */}
              <Avatar name={video?.owner?.fullName.slice(0,1)} size="40" round={true} />
              <input
                type="text"
                placeholder="Add a comment..."
                onClick={() => {
                  setShowCommentIcons(true);
                }}
                value={comment}
                onChange={handleComment}
                className={`w-full px-3 py-2 bg-black text-white outline-none border-b border-white/50 focus:border-white`}
              />
            </div>
            {/* AFTER INPUT ICONS AND COMMENT BUTTON */}
            {showCommentIcons && (
              <div className="flex items-center gap-2 justify-between">
                <div>
                  <span
                    onClick={() => {
                      setShowEmoji((prev) => !prev);
                    }}
                    className="cursor-pointer"
                  >
                    <Smile className="h-5 w-5 text-white mb-4 ml-16" />
                  </span>
                  {showEmoji && (
                    <span>
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => {
                      setShowCommentIcons(false);
                    }}
                    className="hover:bg-[rgba(255,255,255,0.1)] px-6 py-2 hover:rounded-full transition-all duration-100 hover:text-[#717171]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateComment}
                    className={`bg-[rgba(255,255,255,0.1)]  px-6 py-2 rounded-full text-[#717171]  ${
                      comment && "bg-purple-400 text-black"
                    }`}
                  >
                    {createComment?.isPending ? "just a sec" : "Comment"}
                  </button>
                </div>
              </div>
            )}

            <Comment video={video} />
          </div>
        </div>

        {/* Recommended Videos */}

        <div className="w-full  lg:w-[400px] space-y-4">
          {recommendedVideos.map((video, index) => (
            <HomeCard
            w='w-full'
              key={index}
              className="flex gap-2 w-full lg:w-full p-2 bg-gray-900 border-gray-800"
            >
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2 text-white">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-400">{video.channel}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{video.views} Views</span>
                  <span>•</span>
                  <span>{video.timeAgo}</span>
                </div>
              </div>
            </HomeCard>
          ))}
        </div>
      </div>
      {savedModal && <SaveModal onClose={setSavedModal} />}
    </>
  );
}

const recommendedVideos = [
  {
    title: "How does a browser work?",
    channel: "Maluma",
    views: "100K",
    timeAgo: "18 hours ago",
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    title: "Building a multi million dollar startup",
    channel: "Jonas Brothers",
    views: "100K",
    timeAgo: "18 hours ago",
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    title: "Google and Pieces dropped",
    channel: "Billie Eilish",
    views: "100K",
    timeAgo: "18 hours ago",
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    title: "How database works | Engineering",
    channel: "Anuel AA",
    views: "100K",
    timeAgo: "18 hours ago",
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
  {
    title: "Terraform, fig & FreeAPI | UI",
    channel: "Billie Eilish",
    views: "100K",
    timeAgo: "18 hours ago",
    thumbnail: "/placeholder.svg?height=120&width=160",
  },
];

export default VideoPlayer;
