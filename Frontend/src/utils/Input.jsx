import React from "react";

const Input = ({ type = "text", placeholder = "Search", className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`bg-black px-4 py-1 border border-[#D0D5DD] rounded-none text-white outline-none w-   ${className}`}
    />
  );
};

export default Input;
