import React, { useEffect, useState } from "react";
import { useUser } from "../context/User.Context";
import { toast } from "react-toastify";
import HomeSideBar from "../components/HomeSideBar";
import { FaPen, FaSadCry } from "react-icons/fa";
import HomeCard from "../components/HomeCard";
import { Link, useParams } from "react-router-dom";
import { TbUserEdit } from "react-icons/tb";
import { useVideo } from "../context/Videos.Context";
import { useQuery } from "@tanstack/react-query";

const MyChannel = () => {
  const { channelDataAPI, user, updateUserDetails , updateUserAvatar , updateUserCoverImg } =
    useUser();
    const params = useParams();

    const { data: channelData, error: channelError, isLoading: channelLoading } = useQuery({
      queryKey: ["channelProfile",],
      queryFn: ()=>channelDataAPI(params?.username),
      // enabled: !!params?.username,
    });

  const {userVideos} = useVideo()
  const [channelName, setChannelName] = useState(channelData?.message?.fullName);
  const [username, setUsername] = useState(channelData?.message?.username);
  const [isEditing, setIsEditing] = useState(false);
  const [updateCover, setUpdateCover] = useState(null);
  const [updateAvatar, setUpdateAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [showAvatarBtn, setShowAvatarBtn] = useState(true);
  const [showCoverBtn, setShowCoverBtn] = useState(true);
  
  

  // console.log(channelData)
  
  // GET USER VIDEOS
  useEffect(()=>{
    userVideos.mutate(params.username, {
      onSuccess: (data) => {
        // console.log("User videos fetched:", data);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
        console.error("Error fetching user videos:", error);
      },
    });
    channelData
  },[params.username])
  
  if (channelError) return <p>Error in Fetching data {channelError} </p>;
  if (channelLoading) return <p>Loading...</p>;
  

  // HANDLE EDIT CLICK

  const handleEditClick = () => setIsEditing(true);
  // HANDLE CANCEL CLICK
  const handleCancelClick = () => setIsEditing(false);

  // HANDLE SAVE EDITION

  const handleSaveClick = async () => {
    const updatedUserDetails = {
      fullName: channelName,
      username,
    };
    // UPDATE USER DETAILS
    await updateUserDetails.mutate(updatedUserDetails, {
      onSuccess: (updatedUserDetails) => {
        console.log(updatedUserDetails);
        toast.success(updatedUserDetails?.data);
      },
      onError: (error) => {
        console.error("Error:", error);
        toast.error(error?.response?.data?.message);
      },
    });
    setIsEditing(false);
  };

  // HANDLE UPDATE AVATAR

  const handleUpdateAvatar = async () => {
    setAvatarLoading(true)
    const formData=new FormData();
    formData.append("avatar", updateAvatar); // Avatar field name match with backend
    await updateUserAvatar.mutate(formData, {
      onSuccess: (updatedUserAvatar) => {
        setAvatarLoading(false)
        setShowAvatarBtn(true)
        toast.success(updatedUserAvatar?.data);
      },
      onError: (error) => {
        console.error("Error:", error);
        setAvatarLoading(false)
        setShowAvatarBtn(true)
        toast.error(error?.response?.data?.message);
      },
    });
  };

  // HANDLE COVER IMAGE UPDATION

  const handleCoverImageChange = async(e) => {
    setCoverLoading(true)
    const formData=new FormData();
    formData.append("coverImage", updateCover);
    await updateUserCoverImg.mutate(formData,{
      onSuccess: () => {
        queryClient.invalidateQueries(["user", "channelProfile"]);
        setShowCoverBtn(true)
        setCoverLoading(false)
        toast.success("Cover Image Updated Successfully");
      },
      onError: (error) => {
        setShowCoverBtn(true)
        setCoverLoading(false)
        toast.error(error?.response?.data?.message);
      },
    });
  }

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse w-full h-[calc(100vh-72px)] md:justify-start justify-between">
        <HomeSideBar />
        <div className="w-full bg-black text-white overflow-y-scroll">
          {/* Cover Image */}
          <div className="relative">
            <img
              src={ channelData?.message?.coverImage ||"/Main/coverImg.png"}
              alt="Cover Image"
              className="w-full sm:h-60 h-40 object-center"
            />
            {/* EDIT COVER IMAGE */}
            {
              user?.message?.username === channelData?.message?.username && (
                <>
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 text-sm">
                    {
                      showCoverBtn ?(
                        <label htmlFor="coverImage">
                        <FaPen className="text-blue-500 cursor-pointer" />
                          <input type="file"  
                          id="coverImage"
                          className="hidden"
                          onChange={(e)=>{
                            setUpdateCover(e.target.files[0])
                            setShowCoverBtn(false)
                          }}
                           />
                        </label>
                      ):(
                        <button
                        onClick={handleCoverImageChange}
                        className="text-black px-4 font-semibold py-2 text-md"
                        >{coverLoading ? "Uploading...":"Save"}</button>
                      )
                    }
                </div>
                </>
              )
            }
          </div>

          {/* PROFILE SECTION */}

          <div className="px-4 sm:px-6 sm:py-4 flex sm:flex-row flex-col items-start sm:items-center sm:space-x-6">
            {/* AVATAR */}
            
            <div className="relative sm:w-32 sm:h-32 w-16 h-16 -mt-14 z-20 group cursor-pointer">
              {/* AVATAR LOGO */}
              <img
                src={channelData?.message?.avatar || "/Logo/user.png"}
                alt="Profile"
                className="w-full h-full rounded-full border-none"
              />
              {/* EDIT AVATAR */}
              { user?.message?.username === channelData?.message?.username && <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <label 
                htmlFor="avatar"
                >
                  <TbUserEdit
                    className="text-white text-4xl cursor-pointer"
                    
                  />
                  <input
                    id="avatar"
                    type="file"
                    className="hidden"
                    onChange={(e)=>{
                      setUpdateAvatar(e.target.files[0])
                      setShowAvatarBtn(false);
                    }}
                  />
                </label>
              </div>}
              { user?.message?.username === channelData?.message?.username && ( 
               !showAvatarBtn &&  <button 
               disabled={avatarLoading} 
               onClick={handleUpdateAvatar}
               className="sm:ml-0 ml-40 font-bold text-md cursor-pointer "
               >{ avatarLoading ? "Uploading...":"Save" }</button>
                )}
            </div>
            {/* EDIT DETAILS */}
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="bg-gray-800 text-white text-sm font-bold outline-none border border-gray-600 px-2 py-1 rounded-md w-full mb-2"
                    placeholder="Enter channel name"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800 text-white text-sm outline-none border border-gray-600 px-2 py-1 rounded-md w-full"
                    placeholder="Enter username"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-lg sm:text-3xl font-bold">
                    {channelData?.message?.fullName}
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-lg">
                    @{channelData?.message?.username}
                  </p>
                </>
              )}
              <p className="text-gray-400 sm:text-[14px] text-xs sm:py-0 py-1 ">
              Subscribers  {channelData?.message?.subscribersCount} •{" "}
               Subscribed {channelData?.message?.channelsSubscribedToCount}
              </p>
            </div>
            {/* OWNER EDIT BUTTON */}
            {user.message.username === channelData?.message?.username ? (
              <button
                onClick={isEditing ? handleSaveClick : handleEditClick}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg flex items-center space-x-2"
              >
                <FaPen />
                <span className="sm:text-md text-xs">{isEditing ? "Save" : "Edit"}</span>
              </button>
            ) : (
              // HANDLE USER SUBSCRIBED UNSUBSCRIBED BUTTON
              <button
                onClick={
                  channelData?.message?.isSubscribed
                    ? handleSaveClick
                    : handleEditClick
                }
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg flex items-center space-x-2"
              >
                <span className="text-xs sm:text-md">
                  {channelData?.message?.isSubscribed
                    ? "Unsubscribe"
                    : "Subscribe"}
                </span>
              </button>
            )}
            {/* CANCEL BUTTON */}
            {isEditing && (
              <button
                onClick={handleCancelClick}
                className="sm:ml-4 sm:mt-0 mt-1 bg-gray-700 sm:text-md text-xs hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>

          {/* NAVIGATION TABS */}

          <div className="border-b  border-gray-700">
            <div className="flex sm:justify-start justify-evenly space-x-2 sm:space-x-10 text-gray-400 px-2 sm:px-6 py-3">
              <Link
                to={`/${channelData?.message?.username}?cat=all`}
                className=" font-semibold px-4 sm:px-12 bg-white py-2 text-purple-600 border-b-2 border-purple-600  "
              >
                Videos
              </Link>
              <Link
                to={`/${channelData?.message?.username}?cat=playlist`}
                className="hover:text-white "
              >
                Playlist
              </Link>
              <Link
                to={`/${channelData?.message?.username}?cat=community`}
                className="hover:text-white "
              >
                Community
              </Link>
              {/* <button className='hover:text-white'>Following</button> */}
            </div>
          </div>

          {/* OLDEST NEW ALL CHECK BOX */}

          <div className="mt-1">
            <div className="flex justify-start space-x-4 text-gray-400 px-6">
              <Link
                to={`/${channelData?.message?.username}?cat=all`}
                className="hover:text-white border py-1 px-2"
              >
                All
              </Link>
              <Link
                to={`/${channelData?.message?.username}?cat=newest`}
                className=" font-semibold px-6 text-white py-1 bg-purple-600 border-b-2 border-purple-600  "
              >
                Newest
              </Link>
              <Link
                to={`/${channelData?.message?.username}?cat=oldest`}
                className="hover:text-white border py-1 px-2"
              >
                Oldest
              </Link>
            </div>
          </div>

          {/* VEDIOS SHOWCASE */}
          <div className=" w-full grid gap-6 sm:gap-4 md:gap-6 py-4 px-2
    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-scroll h-[600px] custom-scrollbar">
            {
              userVideos?.isPending ?(
                <p>Loading</p>
              ):(
                userVideos?.data?.message?.length === 0 ? (
                  <p>No Videos Yet</p>
                ):
                (
                  userVideos?.data?.message?.map((video) => (
                    <HomeCard
                    key={video?.slug}
                    video={video}
                    />
                  ))
                )
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default MyChannel;
