import { ChevronRight, Settings } from "lucide-react"
import HomeSideBar from "../components/HomeSideBar"
import { useUser } from "../context/User.Context";
import { useQuery } from "@tanstack/react-query";
import millify from "millify";
import { useNavigate } from "react-router-dom";
import { useVideo } from "../context/Videos.Context"
import { useRef, useState } from "react";
import { usePlaylist } from "../context/Playlist.Context";
import axios from "axios";

export default function Collection() {
  const { getHistory , user , userLoading , isAuthenticated } = useUser();
  const {fetchPlaylists,deletePlaylist}=usePlaylist();
  const { fetchUserLikedVideos } = useVideo()
  const [hoveredVideoId, setHoveredVideoId] = useState(null)
  const [durations, setDurations] = useState({})
  const videoRefs = useRef({})
  const navigate = useNavigate();

  
  if(!isAuthenticated){
    return <p>You must Login First</p>
   }

   // GET HISTORIES

   const {
    data: history,
    isLoading:historyLoading,
    error:historyError,
  } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });

   // GET ALL PLAYLISTS

   const { data: playlist, isLoading:playlistLoading, error:playlistError } = useQuery({
    queryKey: ["playlist"],
    queryFn: fetchPlaylists,
  });

  if(userLoading){
    return <p>Loading...</p>
  }

   // GET ALL LIKED VIDEOS

   const {
    data: likedVideo,
    isLoading:likedVideoLoading,
    error:likedVideoError,
  } = useQuery({
    queryKey: ["video"],
    queryFn: async ()=>{
      const res = await axios.post(`https://play-lgud.onrender.com/api/v1/videos/liked` ,{userId:user?.message?._id}, {
        withCredentials: true,
      });
      return res.data
    }
  })

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

  return (
    <div className="w-full flex md:flex-row flex-col h-[calc(100vh-72px)] bg-black overflow-auto text-white lg:gap-4">
      {/* HOME SIDE BAR (Sticky) */}
      <div className="md:hidden absolute w-full bottom-0">
    <HomeSideBar
      width="81px"
      hidden={'hidden'}
      padding="2"
      />
    </div>
    <div className="md:block hidden">
    <HomeSideBar
      width="81px"
      hidden={'hidden'}
      padding="2"
      />
    </div>
    {/* MAIN PART */}
     <div className="h-full w-full overflow-y-auto custom-scrollbar bg-black text-white p-2 md:p-4">
       {/* Header Section */}
       <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl">{user?.message?.fullName.slice(0,1)}</div>
        <div>
          <h1 className="text-2xl font-bold">{user?.message?.fullName}</h1>
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md">Switch account</button>
          </div>
        </div>
      </div>
    
      {/* History Section */}


      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">History</h2>
          <button 
          onClick={()=>{
            navigate('/video/history')
          }}
          className="text-white flex items-center hover:bg-zinc-800 px-3 py-2 rounded-md">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
       
        <div className="overflow-x-auto ">
          <div className="flex gap-4 pb-4">
          {(historyLoading && (
          <p>Loading</p>
        ))}
          {(historyError && (
          <p> Error is Fecthing History </p>
        ))}
            { !historyLoading && !historyError  && history?.message?.map((item) => (
              <div key={item?._id} className="w-[290px]  sm:w-80 shrink-0">
                <div className="relative aspect-video mb-2">
                <div 
                  className="w-full h-full cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(item._id)}
                    onMouseLeave={() => handleMouseLeave(item._id)}
                    onClick={() => {
                      navigate(`/video/${item?.slug}`)
                    }}
                  >
                  <video 
                  src={item?.videoFile} alt="Video thumbnail" 
                  className="rounded-lg object-cover w-full h-full" 
                  ref={(el) => (videoRefs.current[item._id] = el)}
                      onLoadedMetadata={(e) => handleLoadedMetadata(item._id, e)}
                      // muted
                      loop
                      playsInline
                  />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black px-1 rounded text-xs"> {formatTime(durations[item._id])}</div>
                </div>
                <h3 className="font-medium mb-2 truncate">{item?.title||"Video Title Here"}</h3>
                <p 
                onClick={()=>{
                  navigate(`/${item?.owner?.username}`)
                }}
                className="text-sm cursor-pointer text-zinc-400">{item?.owner?.username} • {millify(item?.views)} views</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr />

      {/* Playlists Section */}


      <div className="mb-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Playlists</h2>
            <button className="text-zinc-400 text-sm hover:bg-zinc-800 px-3 py-2 rounded-md">Recently added</button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-800 rounded-full">
              <Settings className="h-4 w-4" />
            </button>
            <button 
            onClick={()=>{
              navigate('/video/plalist')
            }}
            className="flex items-center hover:bg-zinc-800 px-3 py-2 rounded-md">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
          {(playlistLoading && (
          <p>Loading</p>
        ))}
          {(playlistError && (
          <p> Error is Fecthing Playlist </p>
        ))}
            { !playlistLoading && !playlistError && playlist?.message?.map((item) => (
              <div 
              onClick={()=>{
                navigate(`/video/playlist/${item._id}`)
              }}
              key={item._id} 
              className="w-[290px]  sm:w-80 cursor-pointer shrink-0 shadow-sm shadow-red-400 rounded-lg">
                <div className="relative aspect-video mb-2">
                  <img
                    src={playlist?.message[0]?.playlistVideos[0]?.thumbnail || "/placeholder.svg"}
                    alt="Playlist thumbnail"
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 right-0 bg-black/80 px-2 py-1">{millify(item.playlistVideos?.length)} videos</div>
                </div>
                <h3 className="font-medium">{item?.playlistName}</h3>
                <p className="text-sm text-zinc-400">View full playlist</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* LIKED VIDEOS */}


      <hr />
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Liked Videos</h2>
            <button className="text-zinc-400 text-sm hover:bg-zinc-800 px-3 py-2 rounded-md">Recently added</button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-800 rounded-full">
              <Settings className="h-4 w-4" />
            </button>
            <button className="flex items-center hover:bg-zinc-800 px-3 py-2 rounded-md">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">

          {(likedVideoLoading && (
          <p>Loading</p>
        ))}
          {(likedVideoError && (
          <p> Error is Fecthing Liked Videos </p>
        ))}
            
            { !likedVideoLoading && !likedVideoError && likedVideo?.message?.likedVideos?.map((item) => (
              <div key={item._id} className="w-[290px]  sm:w-80 shrink-0">
                <div className="relative aspect-video mb-2">
                  <div 
                  className="w-full h-full cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(item._id)}
                    onMouseLeave={() => handleMouseLeave(item._id)}
                    onClick={() => {
                      navigate(`/video/${item?.slug}`)
                    }}
                  >
                  <video 
                  src={item?.videoFile} alt="Video thumbnail" 
                  className="rounded-lg object-cover w-full h-full" 
                  ref={(el) => (videoRefs.current[item._id] = el)}
                      onLoadedMetadata={(e) => handleLoadedMetadata(item._id, e)}
                      // muted
                      loop
                      playsInline
                  />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black px-1 rounded text-xs"> {formatTime(durations[item._id])}</div>
                </div>
                <h3 
                 onClick={() => {
                  navigate(`/video/${item?.slug}`)
                }}
                className="font-medium cursor-pointer">{item?.title}</h3>
                <p 
                 onClick={() => {
                  navigate(`/${item?.owner?.username}`)
                }}
                className="text-xs cursor-pointer text-zinc-400">@{item?.owner?.username}</p>
                <p className="text-sm text-zinc-400">{millify(item?.views)} views</p>
              </div>
            ))}
          </div>
        </div>
      </div>
     </div>
    </div>
  )
}

