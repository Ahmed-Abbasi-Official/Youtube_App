import React, { useState } from "react";
import Input from "../utils/Input";
import Button from "../utils/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
    const [fileUrl, setFileUrl] = useState(null);
  // REACT HOOK FORM
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log(url)
      setFileUrl(url);
    }
  };
  const onSubmit = (data) => {
    data.file=fileUrl
    console.log(data);
  };
  if(errors){
    console.log(errors)
  }
  return (
    <div className="w-full h-[calc(100vh-72px)]  flex justify-center items-center">
      <div className="flex w-full flex-col items-center gap-8">
        {/* LOGO */}
        <div>
          <img src="/Logo/Logo.png" alt="" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[20%]">
            {/* username */}
         <div className="mb-4">
         <input  
          {...register("username",{required:"username must be provided"})} 
           placeholder="username"
            className=" w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none"
             />
             {errors && (
            <p className="text-[10px] mt-1 text-red-400">{errors?.username?.message}</p>
          )}
         </div>
             {/* fullName */}
         <div className="mb-4">
         <input 
          {...register("fullName",{required:"FullName is required"})} 
          placeholder="fullName" 
          className="w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none" 
          />
            {errors && (
            <p className="text-[10px] mt-1 text-red-400">{errors?.fullName?.message}</p>
          )}
         </div>
          {/* Email */}
          <div className="mb-4">
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
         <div className="mb-4">
         <input 
          {...register("password",{required:"Password is required"})}
          placeholder="password" 
          className="w-full bg-black px-4 py-2 border border-[#D0D5DD] rounded-none text-white outline-none" 
          />
              {errors && (
            <p className="text-[10px] mt-1 text-red-400">{errors?.password?.message}</p>
          )}
         </div>
          {/* AVATAR */}
          <div className="mb-4 cursor-pointer">
            <label htmlFor="avatar" className="cursor-pointer">Choose Avatar</label>
            <input
            id="avatar"
            {...register("file",{required:"Avatar is required"})}
             type="file"
            className="hidden"
            onChange={handleFileChange}
            />
            {fileUrl && <img src={fileUrl} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover" />}
               {errors && (
            <p className="text-[10px] mt-1 text-red-400">{errors?.file?.message}</p>
          )}
          </div>
          <Button
          type="submit"
            value="Create Account"
            className="bg-[#AE7AFF] text-center py-2"
          />
        </form>
        <p className="text-sm text-gray-500">
          if you dont have account?{" "}
          <Link to="/login" className="cursor-pointer text-white">
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
