import React, { useState } from "react";
import Button from "../utils/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "../context/User.Context";
import { toast } from "react-toastify";

const LoginPage = () => {
    const {signinUser}=useUser()

    const navigate = useNavigate();
  // REACT HOOK FORM
  const { register, handleSubmit, formState: { errors } } = useForm();

  // HANDLE SUBMIT FORM

  const onSubmit = async (data) => {
    try {
      const response = await signinUser.mutateAsync(data);
      toast.success(response?.data);
      navigate('/');
    } catch (error) {
      console.error("Error:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  
  return (
    <>
    <div className="w-full h-[calc(100vh-72px)]  flex justify-center items-center">
      <div className="flex w-full flex-col items-center gap-8">
        {/* LOGO */}
        <div>
          <img src="/Logo/Logo.png" alt="" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[65%] sm:w-[45%] md:w-[30%] lg:w-[20%]">
            {/* username */}
         <div className="mb-2">
         <input  
          {...register("username",{required:"username must be provided"})} 
           placeholder="username"
            className=" w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
             />
             {errors && (
            <p className="text-[10px] mt-1 text-red-400">{errors?.username?.message}</p>
          )}
         </div>
          {/* Email */}
          <div className="mb-2">
          <input
          {...register("email",{required:"Email is required"})}
           placeholder="email"
            className="w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
             />
                 {errors && (
            <p className="text-[10px] mt-1 text-red-400">{errors?.email?.message}</p>
          )}
          </div>
          {/* Password */}
         <div className="mb-2">
         <input 
          {...register("password",{required:"Password is required"})}
          placeholder="password" 
          className="w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none" 
          />
              {errors && (
            <p className="text-[10px] mt-1 text-red-400">{errors?.password?.message}</p>
          )}
         </div>
          
          <Button
          disabled={signinUser?.isPending}
          type="submit"
          value={ signinUser?.isPending ? "Just a sec..." : "Continue" }
            className="bg-[#AE7AFF] text-center py-2"
          />
        </form>
        <p className="text-sm text-gray-500">
          if you dont have account?{" "}
          <Link to="/register" className="cursor-pointer text-white">
            Sign up
          </Link>
        </p>
      </div>
    </div>
    </>
    
  );
};

export default LoginPage;
