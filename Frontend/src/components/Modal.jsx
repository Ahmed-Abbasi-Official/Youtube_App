import React, { useState } from "react";
import './Modal.css'
import { Link } from "react-router-dom";
import { useUser } from "../context/User.Context";

const Modal = () => {
  const {user}=useUser();

  return (
    <div
      className={`absolute right-4 top-[78px] text-center w-[45%] sm:w-[35%] lg:w-[25%] p-4 bg-black box-shadow `}
    >
      <span className="absolute right-4 top-2 text-lg font-semibold cursor-pointer md:hidden" onClick={()=>setShow(false)}>X</span>
      <div className="flex flex-col gap-4 justify-center md:justify-start  ">
        {/* USER INFO */}
        <div className="flex flex_col md:flex-row flex-col items-center gap-4">
          <img
            src={user?.message?.avatar || ""}
            className="md:w-12 md:h-12 w-16 h-16 sm:w-20 sm:h-20 bg-cover rounded-full"
          />
          <div>
            <h1 className="text-sm sm:text-xl text-gray-300 font-bold ">
              { user?.message?.fullName || "Full Name" }
            </h1>
            <p className="text-sm text-center md:text-start text-gray-400">{user?.message?.username || "User"}</p>
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex flex-col gap-2">
          {/* UPDATED PROFILE BUTTON */}
          <button className="md:py-2 text-sm sm:text-md md:px-4 py-1 sm:px-2 bg-[#AE7AFF] text-white rounded " onClick={()=>{
          }}>
            Update Profile
          </button>
          {/* LOGOUT  BUTTON */}
          <Link
            className="bg-gray-400 md:py-2 md:px-4 py-1 sm:px-2 text-sm sm:text-md  text-white rounded text-center"
            to='/my-blog'
          >
            My Channel
          </Link>
          <button
            className="bg-[#dc2525] md:py-2 md:px-4 py-1 text-sm sm:text-md sm:px-2 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;