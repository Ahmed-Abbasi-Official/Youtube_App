import React, { useState } from "react";
import { TbCloudUpload } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import UploadDetailsModal from "./UploadDetailsModal";

const UploadVideoModal = ({setShowUploadModal,videos,imp}) => {
  const [video , setVideo]=useState(null);




  return (
    <div className=" animate-slide fixed z-20 bg-black top-[85px] sm:top-[90px] translate-x-1/2 right-1/2 w-[90%] sm:w-[70%]  md:w-[60%] h-[500px]  p-2 sm:p-6 rounded shadow-sm shadow-white">
      <div className="flex flex-col gap-2 sm:gap-4 overflow-y-hidden">
        {/* UPPER PART */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm sm:text-lg font-semibold">Upload and attach files</h2>
            <p className="text-xs sm:text-sm">Upload and attach files to this project.</p>
          </div>
          <button className="" onClick={()=>{
            setShowUploadModal(false)
          }}>
            <RxCross2 className="text-2xl font-bold" />
          </button>
        </div>
        {/* UPLOAD VIDEO */}
        <div className="border py-2 flex  flex-col gap-2 justify-center w-full text-center">
          {/* ICONS */}
          <span>
            <TbCloudUpload className="w-full font-bold text-4xl text-center" />
          </span>
          <p className="text-sm">
            <label htmlFor="video">
            <span className="text-[#9747FF] cursor-pointer">
              Click to upload{" "}
            </span>
            <input
                id="video"
                required
                type="file"
                className="hidden"
                onChange={(e)=>{
                  setVideo(e.target.files[0])
                }}
              />
            </label>
            or drag and drop
          </p>
        </div>
        {/* UPLOAD DETAILS */}
        <div className="overflow-y-auto">
          <UploadDetailsModal
          imp={imp}
          video={video}
          videos={videos}
          onClose={setShowUploadModal}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadVideoModal;
