import React, { useEffect, useState } from "react";
import OtpInput from "./OtpInput";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/User.Context";
import { toast } from "react-toastify";

const VerifiedPopUp = ({ data }) => {
  const [getOtp, setGetOtp] = useState("");
  const [timer, setTimer] = useState();
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const {verifiedOTP}=useUser();
  const navigate = useNavigate();

    // TIMER

  useEffect(() => {
    if (isResendDisabled && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [timer, isResendDisabled]);
  4;

  // GET OTP

  const onOtpSubmit = (otp) => {
    setGetOtp(otp);
  };
  
  // CHECK OTP AND CALL CHECK FROM BACKEND

  const handleOtp = async() => {
     try {
        // console.log(data._id)
         const response = await verifiedOTP.mutateAsync({getOtp,data});
         toast.success("User Registered Successfully");
         navigate('/login');
       } catch (error) {
         console.error("Error:", error?.response?.data?.message);
         toast.error(error?.response?.data?.message);
       }
  };
  

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[65%] md:w-[55%] lg:w-[40%] md:h-[55%] h-[65%] p-2 py-4 bg-black  text-white text-center rounded-lg shadow-md shadow-white ">
      <div className="flex flex-col justify-center items-center gap-2">
        <img src="/Logo/Logo.png" className="w-16 h-16" />
        <h2 className="text-lg font-bold text-[#fff] ">Bloggify</h2>
        <p className="mb-4 w-[90%] sm:w-[60%] text-[12px] text-[#3c3c3c">
          We have sent a verification code to your email{" "}
          <strong>{data?.message || "email"}</strong>. Please enter it below to
          continue.
        </p>
        <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
        <button
          className="mt-4 px-12 py-2 bg-[#AE7AFF] cursor-pointer hover:bg-[#ad7affcb] rounded-lg text-white"
          disabled={!getOtp && true}
          onClick={handleOtp}
        >
          Verify
        </button>
        <p className="text-xs text-gray-300">
          Dont't recive code?{" "}
          <button
            className="text-[#AE7AFF] font-semibold cursor-pointer hover:text-[#ad7affcb] disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={() => {
              resendOtp.mutate();
              setIsResendDisabled(true);
              setTimer(60);
            }}
            disabled={isResendDisabled}
          >
            Resend
            {isResendDisabled && `(${timer}s)`}
          </button>
        </p>
        
      </div>
    </div>
  );
};

export default VerifiedPopUp;