import React, { useState } from "react";
import { useUser } from "../context/User.Context";
import UploadModal from "../components/UploadVideoModal";
import { TiEye } from "react-icons/ti";
import { GrUserAdmin } from "react-icons/gr";
import { FaRegHeart } from "react-icons/fa";
import { useVideo } from "../context/Videos.Context";

const Dashboard = () => {
  const { user, userError, userLoading , isAuthenticated } = useUser();
  const {dashboardData}=useVideo();
  const [showUploadModal, setShowUploadModal] = useState(false);

  if(!isAuthenticated){
    return <p>You must Login First</p>
   }

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error: {userError.message}</div>;
  }

  if (!user) {
    return <div>You are not logged in.</div>;
  }
  // console.log(dashboardData.data);
  return (
    <div className="px-3 sm:px-6 md:px-28 md:py-8 sm:py-4 py-2 relative flex flex-col space-y-5 sm:space-y-6 justify-center h-[calc(100vh-72px)] sm:h-fit overflow-y-auto pt-16  bg-black  ">
        {/* HEAD */}
      <div className="flex sm:flex-row flex-col justify-start gap-3 sm:gap-0 sm:items-center sm:justify-between">
        {/* UPLOAD BUTTON AND TEXT WELCOME */}
        <div className="flex flex-col gap-.5 sm:gap-2">
          <h1 className="md:text-3xl sm:text-xl text-lg font-semibold">
            Welcome back, {user?.message?.fullName}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-[16px]">
            Track, manage and forecast your customers and orders.
          </p>
        </div>
        {/* UPLOAD BUTTON */}
        <button
          className="bg-[#AE7AFF] text-black font-semibold px-4 py-1 sm:px-8 sm:py-2 w-fit "
          onClick={() => {
            setShowUploadModal((prev) => !prev);
          }}
        >
          + Upload
        </button>
      </div>

      {/* LIKES AND FOLLOWERS AND VIEWS */}

      <div className="flex sm:flex-row flex-col items-baseline justify-between sm:items-center gap-3 sm:gap-6">
        {/* TOTAL VIEWS */}
        <div className="text-[14px] sm:text-xs md:text-[18px] border p-3 sm:p-6 flex flex-col justify-center gap-3 sm:gap-4 w-[280px] sm:w-[388px]">
          <TiEye className="text-[42px] bg-[#AE7AFF] text-[#fff] rounded-3xl w-9 font-bold py-2  " />
          <p className="text-sm">Total Views</p>
          <p className="text-3xl font-semibold">{dashboardData?.data?.message?.totalViews || "0"}</p>
        </div>
        {/* FOLLOWERS */}
        <div className="text-[14px] sm:text-xs md:text-[18px] border p-3 sm:p-6 flex flex-col justify-center gap-3 sm:gap-4 w-[280px] sm:w-[388px]">
          <GrUserAdmin className="text-[42px] bg-[#AE7AFF] text-[#fff] rounded-3xl w-9 font-bold py-2  " />
          <p className="text-sm">Total Followers</p>
          <p className="text-3xl font-semibold">{dashboardData?.data?.message?.subscribersCount || "0"}</p>
        </div>
        {/* LIKES */}
        <div className="text-[14px] sm:text-xs md:text-[18px] border p-3 sm:p-6 flex flex-col justify-center gap-3 sm:gap-4 w-[280px] sm:w-[388px]">
          <FaRegHeart className="text-[42px] bg-[#AE7AFF] text-[#fff] rounded-3xl w-9 font-bold py-2  " />
          <p className="text-sm">Total Likes</p>
          <p className="text-3xl font-semibold">{dashboardData?.data?.message?.totalLikes || "0"}</p>
        </div>
      </div>

      {showUploadModal && (
        <UploadModal 
        imp={true}
        setShowUploadModal={setShowUploadModal} />
      )}
    </div>
  );
};

export default Dashboard;
