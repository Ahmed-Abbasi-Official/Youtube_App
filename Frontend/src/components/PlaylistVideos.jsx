import React, { useRef, useState } from "react";
import HomeSideBar from "./HomeSideBar";
import { usePlaylist } from "../context/Playlist.Context";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import millify from "millify";
import { format } from "timeago.js"
import { MoreVertical } from "lucide-react";

const PlaylistVideos = () => {
  const { fetchSinglePlaylist } = usePlaylist();
  const [hoveredVideoId, setHoveredVideoId] = useState(null)
    const [durations, setDurations] = useState({})
    const videoRefs = useRef({})
  const {id}=useParams()
  const navigate=useNavigate(); 

  // GET ALL SINGLE PLAYLISTS

  const {
    data: singlePlaylist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["singlePlaylist"],
    queryFn: ()=>fetchSinglePlaylist(id),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error("Error fetching playlists:", error);
    return <p>Error in Fetching</p>;
  }
  if (singlePlaylist?.message?.length === 0) {
    return <p>No Playlist Yet</p>;
  }

  const handleLoadedMetadata = (id, e) => {
    setDurations((prev) => ({
      ...prev,
      [id]: e.target.duration,
    }))
  }

  // HANDLE MOUSE ENTER

  const handleMouseEnter = (id) => {
    setHoveredVideoId(id)
    if (videoRefs.current[id]) {
      videoRefs.current[id].play().catch(() => {})
    }
  }

  // HANDLE MOUSE LEAVE

  const handleMouseLeave = (id) => {
    setHoveredVideoId(null)
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause()
      videoRefs.current[id].currentTime = 0
    }
  }
  // FORMATE TIME

  const formatTime = (time) => {
    if (!time) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  console.log(singlePlaylist)

  return (
    <div className="w-full h-[calc(100vh-72px)] flex md:flex-row flex-col overflow-auto">
    <div className="md:hidden absolute w-full bottom-0">
      <HomeSideBar width="81px" hidden={"hidden"} padding="2" />
    </div>
    <div className="md:block hidden">
      <HomeSideBar width="81px" hidden={"hidden"} padding="2" />
    </div>
  
    {/* ALL PLAYLIST VIDEOS */}
    <div className="flex flex-col lg:flex-row lg:gap-6 w-full overflow-hidden">
      {/* LEFT SIDE BAR */}
      <div className="w-full h-[220px] lg:w-[400px] bg-[#1a1818] lg:rounded-lg border-b border-white shadow-xl shadow-black shrink-0 sticky top-0 lg:h-[calc(100vh-72px)] p-2 overflow-hidden sm:p-4">
        <div className="relative rounded-xl flex overflow-hidden">
          <img
            src={singlePlaylist?.message?.playlistVideos[0]?.thumbnail || "https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
            alt="Playlist cover"
            className="lg:w-full rounded-lg w-[60%] lg:h-fit h-[180px] aspect-square object-cover"
          />
          <div className="lg:absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="lg:absolute bottom-0 p-2 md:p-4 lg:p-6">
            <h1 className="text-sm md:text-lg lg:text-2xl font-semibold md:font-bold mb-2">
              Playlist Videos
            </h1>
            <p className="text-white mb-1">{singlePlaylist?.message?.playlistName}</p>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>{millify(singlePlaylist?.message?.playlistVideos?.length)} videos</span>
            </div>
          </div>
        </div>
      </div>
  
      {/* RIGHT SIDE VIDEO LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 mb-24">
        <div className="space-y-4 h-[calc(100vh-292px)] mt-4">
          {singlePlaylist?.message?.playlistVideos?.map((video, index) => (
            <div key={video._id} className="flex gap-4 lg:p-0 p-2 mb-20 group cursor-pointer hover:animate-incr">
              <span className="text-gray-400 lg:w-3">{index + 1}</span>
              <div className="relative w-64 h-36">
                <div
                  className="relative group rounded-xl overflow-hidden"
                  onMouseEnter={() => handleMouseEnter(video._id)}
                  onMouseLeave={() => handleMouseLeave(video._id)}
                  onClick={() => {
                    navigate(`/video/${video?.slug}`)
                  }}
                >
                  <video
                    src={video?.videoFile}
                    className="w-full bg-white h-[200px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    ref={(el) => (videoRefs.current[video._id] = el)}
                    onLoadedMetadata={(e) => handleLoadedMetadata(video._id, e)}
                    loop
                    playsInline
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {formatTime(durations[video._id])}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3
                  onClick={() => {
                    navigate(`/video/${video?.slug}`)
                  }}
                  className="text-base font-semibold line-clamp-2">{video?.title}</h3>
                <p 
                 onClick={() => {
                  navigate(`/${video?.owner?.username}`)
                }}
                className="text-gray-400 text-sm mt-1">{video?.owner?.username}</p>
                <p className="text-gray-400 text-sm">
                  {video?.views} views • {format(video?.createdAt)}
                </p>
              </div>
              <button className="h-8 w-8 flex items-center justify-center hover:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default PlaylistVideos;
