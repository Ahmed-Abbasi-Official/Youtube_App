import {
  Search,
  Trash2,
  PauseCircle,
  Settings,
  X,
  MoreVertical,
} from "lucide-react";
import HomeSideBar from "../components/HomeSideBar";
import { useUser } from "../context/User.Context";
import { useQuery } from "@tanstack/react-query";
import millify from "millify";
import { format } from "timeago.js";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HistorySearchBar from "../components/HistorySearchBar";

export default function WatchHistory() {
  const { getHistory, deleteHistory,isAuthenticated, deleteAllHistory, pauseHistory } =
    useUser();
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [durations, setDurations] = useState({});
  const [showPopUpId, setShowPopUpId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const videoRefs = useRef({});
  const { id } = useParams();
  const navigate = useNavigate();

  if(!isAuthenticated){
   return <p>You must Login First</p>
  }

  // GET HISTORIES

  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    console.error("Error fetching history:", error);
    return <p>Error fetching history</p>;
  }
  // if (history?.message.length === 0) {
  //   return <p>No history yet</p>;
  // }

  // Filter History Based on Search
  const filteredHistory = history?.message?.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredHistory)

  const handleLoadedMetadata = (id, e) => {
    setDurations((prev) => ({
      ...prev,
      [id]: e.target.duration,
    }));
  };

  // HANDLE MOUSE ENTER

  const handleMouseEnter = (id) => {
    setHoveredVideoId(id);
    if (videoRefs.current[id]) {
      videoRefs.current[id].play().catch(() => {});
    }
  };

  // HANDLE MOUSE LEAVE

  const handleMouseLeave = (id) => {
    setHoveredVideoId(null);
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause();
      videoRefs.current[id].currentTime = 0;
    }
  };
  // FORMATE TIME

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // DELETE HISTORY

  const handleDeleteFromHistory = async (playlistId) => {
    await deleteHistory.mutate(playlistId, {
      onSuccess: (data) => {
        console.log(data);
        toast.success(data?.data);
      },
      onError: (error) => {
        console.error("Error deleting history:", error);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  // DELETE ALL HISTORY

  const handleDeleteAllHistory = async () => {
    await deleteAllHistory.mutate({
      onSuccess: (data) => {
        console.log(data);
        toast.success(data?.data);
      },
      onError: (error) => {
        console.error("Error deleting all history:", error);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  // PAUSE HISTORY

  const handlePauseHistory = async () => {
    await pauseHistory.mutate({
      onSuccess: (data) => {
        console.log(data);
        toast.success(data?.data);
      },
      onError: (error) => {
        console.error("Error pausing history:", error);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  return (
    <div className="w-full flex md:flex-row flex-col h-[calc(100vh-72px)] bg-black overflow-auto text-white lg:gap-4">
      {/* HOME SIDE BAR (Sticky) */}
      <div className="md:hidden absolute w-full bottom-0">
        <HomeSideBar width="81px" hidden={"hidden"} padding="2" />
      </div>
      <div className="md:block hidden">
        <HomeSideBar width="81px" hidden={"hidden"} padding="2" />
      </div>
      {/* MAIN BAR */}
      <div className="  w-full h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar p-3 md:p-6 ">

        {/* UPPER PART */}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-white">Watch History</h2>
        </div>

        {/* VIDEOS + BUTTONS */}

        <div className="flex pb-20 sm:flex-row flex-col-reverse sm:gap-0 gap-14  md:justify-between w-full">
          {/* History List */}
          {history?.message.length === 0 && <p>No History Yet</p>}
          {filteredHistory?.length === 0 && <p>No History Found</p>}
          <div className="space-y-4">
            {filteredHistory?.map((item) => (
              <div
                key={item._id}
                className="flex sm:flex-row flex-col w-full  cursor-pointer gap-4 group"
              >
                {/* Thumbnail */}
                <div
                  onMouseEnter={() => handleMouseEnter(item._id)}
                  onMouseLeave={() => handleMouseLeave(item._id)}
                  onClick={() => {
                    navigate(`/video/${item?.slug}`);
                  }}
                  className="relative  flex-shrink-0"
                >
                  <video
                    src={item?.videoFile}
                    className="sm:w-52 w-full bg-white h-44 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    ref={(el) => (videoRefs.current[item._id] = el)}
                    onLoadedMetadata={(e) => handleLoadedMetadata(item._id, e)}
                    loop
                    playsInline
                  />
                  <span className="absolute w-8 bottom-1 right-1 bg-black px-1 text-xs rounded">
                    {formatTime(durations[item?._id])}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex sm:gap-6 items-center justify-between">
                    <h3
                      onClick={() => {
                        navigate(`/video/${item?.slug}`);
                      }}
                      className="text-xs sm:text-lg md:text-xl font-medium"
                    >
                      {item?.title}
                    </h3>
                    <div className="flex sm:gap-2">
                      <button
                        onClick={() => handleDeleteFromHistory(item._id)}
                        className="p-1 hover:bg-[#272727] rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <h2
                      onClick={() => {
                        navigate(`/${item?.owner?.username}`);
                      }}
                      className=" text-xs text-gray-400"
                    >
                      {item?.owner?.username}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {millify(item?.views)} views <span>•</span>{" "}
                      <span>{format(item?.createdAt)}</span>{" "}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Header */}

          <div>
            <div className="flex lg:w-64 w-52 items-center mb-6 space-x-4">
              <div className="flex relative">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full bg-black   py-2 px-4 pl-10 outline-none border-b border-white/50 focus:border-white "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-6 sm:gap-4 mb-6  ">
              <button
                onClick={handleDeleteAllHistory}
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <Trash2 className="h-5 w-5" />
                Clear all watch history
              </button>
              {/* <button 
              onClick={handlePauseHistory}
              className="flex items-center gap-2 text-gray-300 hover:text-white">
                <PauseCircle className="h-5 w-5" />
                Pause watch history
              </button> */}
            </div>
          </div>
          {deleteAllHistory?.isPending && (
            <p className="absolute top-[72px] h-[calc(100vh-72px)] flex items-center justify-center right-1/2 translate-x-1/2 text-white text-4xl bg-black/50 font-semibold w-full  z-20 ">
              Deleting...
            </p>
          )}
          {deleteHistory?.isPending && (
            <p className="absolute top-[72px] h-[calc(100vh-72px)] flex items-center justify-center right-1/2 translate-x-1/2 text-white text-4xl bg-black/50 font-semibold w-full  z-20 ">
              Deleting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
