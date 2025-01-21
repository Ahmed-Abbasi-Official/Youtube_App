import React, { useEffect, useRef, useState } from "react";

const OtpInput = ({ length = 6, onOtpSubmit = () => {} }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  //   console.log(otp);

//   FOR HANDLE CHANGE

  const handleChange = (index, e) => {
    const value = (e.target.value).toString();
    // console.log(value);

    if (isNaN(value)) return;
    const newOtp = [...otp];

    // ALLOW ONLY ONE INPUT

    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // SUBMIT TRIGGER

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    //  MOVE TO NEXT INPUT

    if(value && index<length-1 && inputRefs.current[index+1]){
        inputRefs.current[index+1].focus();
    }

  };

//   FOR FORWAR COURSOR

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1,1)
    if(index>0 && !otp[index-1]){
        inputRefs.current[otp.indexOf("")].focus();
    }
  };


//  FOR BACKSPACE

  const handleKeyDown = (index, e) => {
    // FOR MOVING BACK
    if(e.key==="Backspace" && !otp[index] && index>0 && inputRefs.current[index-1]){
        inputRefs.current[index-1].focus();
    }
  };

  return (
    <div>
      {otp.map((value, index) => (
        <input
          key={index}
          ref={(input) => (inputRefs.current[index] = input)}
          type="text"
          value={value}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-14 h-14 m-1 text-center bg-[#f2f2f2] border border-[#AE7AFF] text-xl text-[#444]  rounded-md outline-blue-800"
        />
      ))}
    </div>
  );
};

export default OtpInput;