import React from "react";
import HomeSideBar from "../components/HomeSideBar";
import { Search } from "lucide-react";
import millify from "millify";
import { useUser } from "../context/User.Context";
import { useQuery } from "@tanstack/react-query";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscribersAndSubscribed = () => {
  const {getCommunity,user} = useUser();
  const [toggleSubs , setToggleSubs] = useState(false);
  const navigate = useNavigate();
  
  // GET COMMUNITY

  const {data:community,isLoading,error}=useQuery({
    queryKey: ["community"],
    queryFn: getCommunity
  })
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error("Error fetching community:", error);
    return <div>Error fetching community</div>;
  }


  // SUBSCRIBER OF SUBCRIBED USER

  const subscribersOfSubscribed=[]
    community?.message?.subscribed?.map((val)=>{
      subscribersOfSubscribed.push(val?.subscriber)
    })

    // // SUBSCRIBER OF EVERY USER

    const subscriberOfUser = [];
    community?.message?.subscribers?.map((val)=>{
        subscriberOfUser.push(val?.subscriber?._id)
    })
  
  
  return (
    <div className="w-full flex md:flex-row flex-col h-[calc(100vh-72px)] bg-black overflow-auto text-white lg:gap-4">
      {/* HOME SIDE BAR (Sticky) */}
      <div className="md:hidden absolute w-full bottom-0">
        <HomeSideBar width="81px" hidden={"hidden"} padding="2" />
      </div>
      <div className="md:block hidden">
        <HomeSideBar width="81px" hidden={"hidden"} padding="2" />
      </div>
      {/* MAIN PART */}
      <div className="flex flex-col gap-6 w-full p-2 md:p-4">
        {/* BUTTONS */}
        <div className="flex w-fit  py-1 px-1 border border-white gap-1">
          <button 
          onClick={()=>{
            setToggleSubs(false)
          }}
          className={`py-1 font-semibold px-4 text-sm ${toggleSubs ? ("bg-black") : ("bg-purple-600")} md:text-lg`}>Subscribers</button>
          <span className="border-r-2 border-white"></span>
          <button 
          onClick={()=>{
            setToggleSubs(true)
          }}
          className={`py-1 font-semibold px-4 text-sm ${toggleSubs ? ("bg-purple-600") : ("bg-black")} md:text-lg`}>Subscribed</button>
        </div>
        {/* TOTAL SUBSCRIBER */}
        <h1 className="font-bold text-sm md:text-lg">{toggleSubs ? ( `Total Subscribed : ${millify(community?.message?.subscribed?.length)}` ) : (`Total Subscribers : ${millify(community?.message?.subscribers?.length)}` )}</h1>
        {/* ALL SUBSCRIBERS AND SEARCH BUTTONS */}
        <div className="flex w-full sm:flex-row sm:px-0 px-1 flex-col-reverse md:justify-between">
          {/* SUBSCRIBERS */}
          {
            // SUBSCRIBED
            toggleSubs ? (
              community?.message?.subscribed?.map((user,idx)=>(
                <div key={idx}
                className="flex w-full items-center justify-between px-1 sm:px-8 md:px-12 gap-2"
                >
                  {/* USER INFO */}
                 <div className="flex items-center gap-3">
                 <img 
                 src={ user?.channel?.avatar ||"/Logo/Logo.png"} 
                 alt={ user?.channel?.username ||"user"}
                 className="md:w-20 md:h-20 sm:w-16 sm:h-16 w-14 h-14 object-cover rounded-full"
                 onClick={()=>{
                  navigate(`/${user?.channel?.username}`)
                 }}
                 />
                 <div className="flex flex-col ">
                  <span 
                   onClick={()=>{
                    navigate(`/${user?.channel?.username}`)
                   }}
                  className="text-sm md:text-lg font-semibold cursor-pointer">{user?.channel?.fullName}</span>
                  <span 
                   onClick={()=>{
                    navigate(`/${user?.channel?.username}`)
                   }}
                  className="text-xs md:text-sm  text-gray-400 cursor-pointer">@{user?.channel?.username}</span>
                  <sapn className="text-[10px] text-gray-400">{millify(subscribersOfSubscribed?.length)} subscribers</sapn>
  
                 </div>
                 </div>
                 {/* Unfollow BUTTON
                 <button className=" py-1 md:py-2 md:px-5 text-xs sm:text-sm px-1 sm:px-3 bg-purple-600 font-semibold md:font-bold">
                  Unsubscribed
                 </button> */}
                </div>
              ))
            ):(
              // SUBSCRIBERS
              community?.message?.subscribers?.map((user,idx)=>(
                <div key={idx}
                className="flex w-full items-center justify-between px-1 sm:px-8 md:px-12 gap-2"
                >
                  {/* USER INFO */}
                 <div className="flex items-center gap-3">
                 <img 
                 src={ user?.subscriber?.avatar ||"/Logo/Logo.png"} 
                 alt="user"
                 className="md:w-20 md:h-20 sm:w-16 sm:h-16 w-14 h-14 object-cover rounded-full"
                 onClick={()=>{
                  navigate(`/${user?.subscriber?.username}`)
                 }}
                 />
                 <div className="flex flex-col ">
                  <span 
                  onClick={()=>{
                    navigate(`/${user?.subscriber?.username}`)
                   }}
                  className="text-sm md:text-lg font-semibold cursor-pointer">{user?.subscriber?.fullName}</span>
                  <span 
                  onClick={()=>{
                    navigate(`/${user?.subscriber?.username}`)
                   }}
                  className="text-xs md:text-sm  text-gray-400 cursor-pointer">@{user?.subscriber?.username}</span>
                  <sapn className="text-[10px] text-gray-400">{millify(subscriberOfUser?.length)} subscribers</sapn>
  
                 </div>
                 </div>
                 {/* FOLLOW BACK BUTTON
                 <button className=" py-1 md:py-2 md:px-5 text-xs sm:text-sm px-1 sm:px-3 bg-purple-600 font-semibold md:font-bold">
                  follow back
                 </button> */}
                </div>
              ))
            )
          }
          
          {/* Search Header */}
            {/* <div className="flex lg:w-64 w-52 items-center mb-6 space-x-4">
              <div className="flex relative">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full bg-black   py-2 px-4 pl-10 outline-none border-b border-white/50 focus:border-white "
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>   */}
        </div>
      </div>
    </div>
  );
};

export default SubscribersAndSubscribed;
