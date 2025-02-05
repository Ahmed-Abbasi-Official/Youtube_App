import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useVideo } from "../context/Videos.Context";
import { useNavigate } from "react-router-dom";

const UploadDetailsModal = ({ video , videos , imp=true , onClose , thumbnail }) => {
  const {uploadVideo,cancelUpload , updateVideo} = useVideo();
  const [loading , setLoading]=useState(false);
  const navigate = useNavigate();
  // REACT HOOK FORM
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: videos?.title || "Title", // Default value for title
      description: videos?.description || "desc", // Default value for title
      category: videos?.category || "category", // Default value for title
      privacy: videos?.isPublic || "privacy", // Default value for title
    },
  });

  // ON SUBMIT

  const onSubmit =async (data) => {
    if (!video && imp) {
      setLoading(true);
      return toast.error("Please enter a video");
    }
    const formData=new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("video", video); // Video field name match with backend
    formData.append("category", data.category);
    formData.append("thumbnail", thumbnail); 
    formData.append("isPublic", data.privacy); // Tags field name match with backend
    

    if(imp){
      setLoading(true);
      await uploadVideo.mutate(formData ,  {
        onSuccess: (data) => {
          setLoading(false)
          console.log(data)
          toast.success(data?.data);
          navigate(`/video/${data?.message?.slug}`)
        },
        onError: (error) => {
          console.error("Error:", error);
          setLoading(false)
          toast.error(error?.response?.data?.message);
        },
      })
    }else{
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      console.log(data)
      setLoading(true);
      // console.log(videos)
      await updateVideo.mutate(
        { videoId: videos?._id, data: formData },  // 👈 Pehla argument ek object hona chahiye
        {
          onSuccess: (data) => {
            setLoading(false);
            toast.success(data?.data);
            onClose(false)
            navigate(`/video/${data?.message?.slug}`);
          },
          onError: (error) => {
            console.error("Error:", error);
            setLoading(false);
            toast.error(error?.response?.data?.message);
          },
        }
      );
      
    }

  };
  // console.log(videos)

  // HANDEL CANCEL UPLOAD

  const handleCancelUpload = () => {
    cancelUpload();
    setLoading(false);
    toast.info("Video upload canceled");
  };

  // console.log(videos)

  return (
    <>
    <div className="overflow-y-auto custom-scrollbar h-[300px] ">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="mb-2">
          <label htmlFor="title">
            Title*
            <input
              {...register("title", {
                required: imp ? "title must be provided" : false ,
              })}
              placeholder={ videos?.title || "Title"}
              className="mt-2 w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              id="title"
            />
          </label>
          {errors && (
            <p className="text-[10px] mt-1 text-red-400">
              {errors?.title?.message}
            </p>
          )}
        </div>
        {/* Description */}
        <div className="mb-2">
          <label htmlFor="description">
            Description*
            <textarea
              {...register("description", {
                required: imp ? "description must be provided" : false,
              })}
              placeholder={ videos?.description || "description"}
              className="mt-2 w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              id="description"
            />
          </label>
          {errors && (
            <p className="text-[10px] mt-1 text-red-400">
              {errors?.description?.message}
            </p>
          )}
        </div>
        {/* Category */}
        <div className="mb-2">
          <label htmlFor="Category">
            Select Category*
            <select
              {...register("category")}
              className="mt-2 w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              id="category"
            >
              <option value="general">{ videos?.category || "General"}</option>{" "}
              {/* Default placeholder */}
              <option value="technology">Technology</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </label>
        </div>
        {/* PUBLIC AND PRIVATE */}
        <div className="mb-2">
          <label htmlFor="Privacy">
            Select Privacy*
            <select
              {...register("privacy")}
              className="mt-2 w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              id="Privacy"
            >
              <option value="public">{ videos?.isPublic || "public"}</option>{" "}
              {/* Default placeholder */}
              <option value="private">private</option>
            </select>
          </label>
        </div>
        {/* BUTTONS */}
        <div className="flex sm:flex-row flex-col gap-4 justify-evenly mt-3 sm:mt-4 w-full z-20">
          <button type="submit" className="text-black bg-[#AE7AFF] py-3 px-16"
          disabled={loading}
          >
            { imp ? (loading ? "Uploading..." :"Upload"):(loading ? "Updating..." : "Update" )}
          </button>
        </div>
      </form>
      </div>
      {
        loading && (
          <>
          <div className=" absolute top-0 left-0 opacity-25 flex items-center justify-center text-center bg-white w-full h-full">
            <div className="text-black text-4xl font-bold">Uploading wait ...
              <br />
            {loading && <span
            className="text-black mt-2 text-lg shadow-xl shadow-white py-3 px-4 border cursor-pointer "
            onClick={handleCancelUpload}
            >Cancel</span>}
            </div>
          </div>
          
          </>
        )
      }
    </>
  );
};

export default UploadDetailsModal;
