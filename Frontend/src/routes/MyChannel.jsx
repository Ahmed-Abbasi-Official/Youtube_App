import React, { useEffect, useState } from "react";
import { useUser } from "../context/User.Context";
import { toast } from "react-toastify";
import HomeSideBar from "../components/HomeSideBar";
import { FaPen } from "react-icons/fa";
import HomeCard from "../components/HomeCard";
import { Link, useSearchParams } from "react-router-dom";

const MyChannel = () => {
  const { channelData , channelLoading , channelError , user } = useUser();
  const [channelName, setChannelName] = useState(
    "channelName"
  );
  const [username, setUsername] = useState(
    "username"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams] = useSearchParams();

  if(channelError) return <p>Error in Fetching data {channelError} </p>
  if(channelLoading) return <p>Loading...</p>


  console.log(channelData)
  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);

  const handleSaveClick = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse w-full h-[calc(100vh-72px)] md:justify-start justify-between">
        <HomeSideBar />
        <div className="w-full bg-black text-white overflow-y-scroll">
          {/* Cover Image */}
          <div className="relative">
            <img
              src="/Main/coverImg.png"
              alt="Cover Image"
              className="w-full h-60 object-cover"
            />
          </div>

          {/* PROFILE SECTION */} 

          <div className="px-6 py-4 flex items-center space-x-6">
            <img
              src={channelData?.message?.avatar || "/Logo/user.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-none -mt-14 z-20 "
            />
            {/* EDIT DETAILS */}
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={channelData?.message?.fullName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="bg-gray-800 text-white text-sm font-bold outline-none border border-gray-600 px-2 py-1 rounded-md w-full mb-2"
                    placeholder="Enter channel name"
                  />
                  <input
                    type="text"
                    value={channelData?.message?.username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800 text-white text-sm outline-none border border-gray-600 px-2 py-1 rounded-md w-full"
                    placeholder="Enter username"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{channelData?.message?.fullName}</h1>
                  <p className="text-gray-400 text-lg">@{channelData?.message?.username}</p>
                </>
              )}
              <p className="text-gray-400">{channelData?.message?.subscribersCount} • {channelData?.message?.channelsSubscribedToCount}</p>
            </div>
            { user.message.username === channelData?.message?.username ? (<button
              onClick={isEditing ? handleSaveClick : handleEditClick}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg flex items-center space-x-2"
            >
              <FaPen />
              <span>{isEditing ? "Save" : "Edit"}</span>
            </button>)
          :(
            <button
              onClick={channelData?.message?.isSubscribed ? handleSaveClick : handleEditClick}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>{channelData?.message?.isSubscribed ? "Subscribe" : "Unsubscribe"}</span>
            </button>
          )  
          }
            {isEditing && (
              <button
                onClick={handleCancelClick}
                className="ml-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>

          {/* NAVIGATION TABS */}

          <div className="border-b  border-gray-700">
            <div className="flex justify-start space-x-10 text-gray-400 px-6 py-3">
              <Link to={`/${channelData?.message?.username}?cat=all`} className=" font-semibold px-12 bg-white py-2 text-purple-600 border-b-2 border-purple-600  ">
                Videos
              </Link>
              <Link to={`/${channelData?.message?.username}?cat=playlist`} className="hover:text-white">Playlist</Link>
              <Link to={`/${channelData?.message?.username}?cat=community`} className="hover:text-white">Community</Link>
              {/* <button className='hover:text-white'>Following</button> */}
            </div>
          </div>

          {/* OLDEST NEW ALL CHECK BOX */}

          <div className="mt-1">
            <div className="flex justify-start space-x-4 text-gray-400 px-6">
              <Link to={`/${channelData?.message?.username}?cat=all`} className="hover:text-white border py-1 px-2">All</Link>
              <Link to={`/${channelData?.message?.username}?cat=newest`} className=" font-semibold px-6 text-white py-1 bg-purple-600 border-b-2 border-purple-600  ">
                Newest
              </Link>
              <Link to={`/${channelData?.message?.username}?cat=oldest`} className="hover:text-white border py-1 px-2">
                Oldest
              </Link>
            </div>
          </div>
          {/* VEDIOS SHOWCASE */}
          {/* VIDEOS SHOWCASE */}
          <div className=" flex flex-wrap py-4 lg:gap-4 gap-6 sm:gap-2 justify-center w-full bg-black overflow-y-scroll h-[600px] custom-scrollbar">
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
            <HomeCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyChannel;
