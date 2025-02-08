import { MoreVertical, ChevronDown } from "lucide-react"
import HomeSideBar from "../components/HomeSideBar"
import { usePlaylist } from "../context/Playlist.Context"
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import millify from "millify";
import { CgPlayList } from "react-icons/cg";
import { format } from "timeago.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/User.Context";

export default function Playlists() {
    const {fetchPlaylists,deletePlaylist}=usePlaylist();
    const {isAuthenticated}=useUser();
    const [showPopUpId, setShowPopUpId] = useState(null);
    const navigate = useNavigate();
      // GET ALL PLAYLISTS

      if(!isAuthenticated){
        return <p>You must Login First</p>
       }

  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ["playlist"],
    queryFn: fetchPlaylists,
  });

  if(isLoading){
    return <p>Loading...</p>
  }
  if(error){
    console.error("Error fetching playlists:", error)
    return <p>Error in Fetching</p>
  }
  if(playlist?.message?.length === 0){
    return <p>No Playlist Yet</p>
  }

  // DLETE PLAYLIST

  const handleDeletePlaylist=async(playlistId)=>{
    await deletePlaylist.mutate(playlistId , {
      onSuccess: (data) => {
        toast.success(data?.data)
      },
      onError: (error) => {
        console.error("Error deleting playlist:", error);
        toast.error(error?.response?.data?.message);
      },
    })
  }

  return (
   <>
    <div className="flex md:flex-row flex-col h-[calc(100vh-72px)] w-full   bg-black">
         {/* HOME SIDE BAR */}
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

    <div 
    className="h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar bg-black p-6">

        {/*HEADER */}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-white">Playlists</h1>
        {/* <button className="text-white flex items-center">
          Recently added <ChevronDown className="ml-2 h-4 w-4" />
        </button> */}
      </div>

      {/* ALL PLAYLISTS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {playlist?.message?.map((playlist, index) => (
          <div key={index} 
          className="bg-zinc-900 shadow-md shadow-red-300 hover:animate-incrBig text-white overflow-hidden group cursor-pointer rounded-lg">
            <div className="relative">
              <img
               onClick={()=>{
                navigate(`/video/playlist/${playlist?._id}`)
              }}
                src={playlist?.playlistVideos[0]?.thumbnail || "/placeholder.svg"}
                alt={playlist._id}
                className="w-full aspect-video object-cover"
              />
              <div 
               onClick={()=>{
                navigate(`/video/playlist/${playlist?._id}`)
              }}
              className="absolute bottom-2 flex items-center gap-2 right-2 bg-black/80 px-2 py-1 text-xs rounded">
                <CgPlayList className="w-6 h-6" /> {millify(playlist?.playlistVideos?.length)} Videos
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 
                   onClick={()=>{
                    navigate(`/video/playlist/${playlist?._id}`)
                  }}
                  className="font-semibold mb-1">{playlist?.playlistName}</h3>
                  <div
                   onClick={()=>{
                    navigate(`/video/playlist/${playlist?._id}`)
                  }}
                  className="text-zinc-400 text-sm space-y-1">
                    {/* <p>
                      {playlist.privacy} • {playlist.type}
                    </p> */}
                    <p>{format(playlist?.createdAt)}</p>
                  </div>
                </div>
                    {/* THREE DOTS */}

            <button
              onClick={() =>
                setShowPopUpId((prev) =>
                  prev === playlist._id ? null : playlist._id
                )
              }
              className="text-gray-400 hover:text-gray-300 relative"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
              {showPopUpId === playlist._id && (
                <div className="bg-black shadow-sm  shadow-white w-24 rounded-md py-1 px-2 absolute z-20 -top-2 right-12">
                  <div className="flex flex-col justify-center items-center w-full gap-2">
                    {/* <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="bg-gray-400 md:py-2 md:px-4 py-1 sm:px-2 text-sm sm:text-md w-full text-white rounded text-center"
                    >
                      Edit
                    </button> */}
                    <button
                      className="bg-[#dc2525] md:py-1 md:px-2 py-1 text-sm sm:text-md w-full sm:px-2 text-white rounded"
                      onClick={() => handleDeletePlaylist(playlist._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </button>
              </div>
            </div>
          </div>
        ))}
         {
      deletePlaylist?.isPending && (
        <p className="absolute top-[72px] h-[calc(100vh-72px)] flex items-center justify-center right-1/2 translate-x-1/2 text-white text-4xl bg-black/50 font-semibold w-full  z-20 ">Deleting...</p>
      )
    }
      </div>
    </div>
    </div>
   </>
  )
}

