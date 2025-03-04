import React, { useState } from "react";
import Button from "../utils/Button";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUser } from "../context/User.Context";
import Modal from "./Modal";
import MobileBar from "./MobileBar";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { isAuthenticated , user} = useUser();
  const [mobileBar, setMobileBar] = useState(false);
  const [modal, setModal] = useState(false);
  // console.log(isAuthenticated,user)

 

  return (
    <>
      <div className="h-[72px] border-b-2 border-[##EAECF0]  px-4 pb-8  md:px-8">
        {/* DESKTOP MENU */}
        <div className="hidden md:flex justify-between items-center relative">
          {/* LOGO */}
          <Link to="/">
            <img
              src="/Logo/Logo.png"
              className="w-16 h-16 bg-cover "
              loading="lazy"
              alt=""
            />
          </Link>
          {/* SEARCH */}
         <SearchBar/>
          {/* BUTTONS */}
          <div className="flex gap-6 md:gap-8 justify-center items-center">
            {/* THREE DOTS */}
            {/* <HiOutlineDotsVertical className="cursor-pointer" /> */}
            {/* LOGIN */}
            {isAuthenticated ? (
              <img
                src={user?.message?.avatar}
                alt="User Image"
                className="w-11 h-11 rounded-full bg-cover cursor-pointer "
                onClick={() => {
                  setModal((prev) => !prev);
                  setMobileBar(false); // Close the mobile menu
                }}
              />
            ) : (
              <>
                <Link to="/login">
                  <Button value="Log in" />
                </Link>
                <Link
                  to="/register"
                  className="bg-[#AE7AFF] shadow-custom py-1 px-2"
                >
                  <Button value="Sign up" className="text-black" />
                </Link>
              </>
            )}
          </div>
        </div>
        {modal && <Modal />}

        {/* MOBILE MENU */}
        <div className="md:hidden flex justify-between items-center">
          <Link to='/'>
          <img
            src="/Logo/Logo.png"
            className="w-16 h-16 bg-cover ml-7 "
            alt="LOGO"
          />
          </Link>
          <div className="flex justify-center items-center gap-2">
            <FiSearch className="text-3xl cursor-pointer" />
            <img
              src="/Logo/Hamburger.png"
              className="w-16 h-16 bg-cover cursor-pointer "
              alt="Hamburger"
              onClick={() => {
                setMobileBar((prev) => !prev);
              }}
            />
          </div>
        </div>
      </div>
      {mobileBar && (
        <div
        className={`absolute z-20 top-[76px] w-full h-60 bg-black shadow-sm shadow-white ${
          mobileBar ? "animate-slideIn" : "translate-x-full"
        }`}
      >
        <MobileBar setMobileBar={setMobileBar}  />
      </div>
      
      )}
    </>
  );
};

export default Navbar;
