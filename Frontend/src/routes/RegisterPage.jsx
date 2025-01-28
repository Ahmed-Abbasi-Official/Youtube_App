import React, { useState } from "react";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "../context/User.Context";
import { toast } from "react-toastify";
import VerifiedPopUp from "../components/VerifiedPopUp";
import {  PuffLoader } from "react-spinners";



const RegisterPage = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [getFileUrl, setgetFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [data, setData] = useState("");
  const { signupUser } = useUser();
  // REACT HOOK FORM
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // HANDLE AVATAR FILE

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
    setgetFileUrl(file)
    // console.log(file)
      const url = URL.createObjectURL(file);
      // console.log(url)
      setFileUrl(url);
    }
  };
  // HANDLE SUBMIT FORM

  const onSubmit = async (data) => {
    console.log(data)

    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("avatar", getFileUrl); // Avatar field name match with backend
      const response = await signupUser.mutateAsync(formData);
      setShowPopUp(true);
      toast.success(response?.data);
      setData(response);
    } catch (error) {
      // console.error("Error:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  console.log(data);

  return (
    <>
      <div className="w-full h-[calc(100vh-72px)]  flex justify-center items-center">
        <div className="flex w-full flex-col items-center gap-8 overflow-y-auto">
          {/* LOGO */}
          <div>
            <img src="/Logo/Logo.png" alt="" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-[65%] sm:w-[45%] md:w-[30%] lg:w-[20%]"
          >
            {/* username */}
            <div className="mb-2">
              <input
                {...register("username", {
                  required: "username must be provided",
                })}
                placeholder="username"
                className=" w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              />
              {errors && (
                <p className="text-[10px] mt-1 text-red-400">
                  {errors?.username?.message}
                </p>
              )}
            </div>
            {/* fullName */}
            <div className="mb-2">
              <input
                {...register("fullName", { required: "FullName is required" })}
                placeholder="fullName"
                className="w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              />
              {errors && (
                <p className="text-[10px] mt-1 text-red-400">
                  {errors?.fullName?.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="mb-2">
              <input
                {...register("email", { required: "Email is required" })}
                placeholder="email"
                className="w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              />
              {errors && (
                <p className="text-[10px] mt-1 text-red-400">
                  {errors?.email?.message}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="mb-2">
              <input
                {...register("password", { required: "Password is required" })}
                placeholder="password"
                className="w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
              />
              {errors && (
                <p className="text-[10px] mt-1 text-red-400">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            {/* AVATAR */}
            <div className="mb-2 cursor-pointer">
              <label htmlFor="avatar" className="cursor-pointer">
                Choose Avatar
              </label>
              <input
                id="avatar"
                {...register("file", { required: "Avatar is required" })}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileUrl && (
                <img
                  src={fileUrl}
                  alt="Preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover"
                />
              )}
              {errors && (
                <p className="text-[10px] mt-1 text-red-400">
                  {errors?.file?.message}
                </p>
              )}
            </div>
          <Button
              type="submit"
              value={
                loading ? (
                  <div className="flex justify-center items-center">
                    <PuffLoader
                      height={20}
                      width={20}
                      color="#ffffff"
                      secondaryColor="#ffffff80"
                      strokeWidth={4}
                      strokeWidthSecondary={4}
                      ariaLabel="loading"
                    />
                  </div>
                ) : (
                  "Create Account"
                )
              }
              className="bg-[#AE7AFF] text-center py-2 w-full relative flex items-center justify-center px-4 text-white rounded-md  transition-all duration-300 disabled:opacity-75"
              disabled={loading}
            />
          </form>
          <p className="text-sm text-gray-500">
            if you already have account?{" "}
            <Link to="/register" className="cursor-pointer text-white">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* VERIFIED OTP */}
      {showPopUp && <VerifiedPopUp data={data.message} />}
    </>
  );
};

export default RegisterPage;
