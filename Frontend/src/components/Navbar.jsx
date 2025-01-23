import React, { useEffect, useState } from "react";
import Input from "../utils/Input";
import Button from "../utils/Button";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/User.Context";
import Modal from "./Modal";

const Navbar = () => {
  const { user, userError, userLoading } = useUser();
  const [showUser, setShowUser] = useState(false);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate()

  
  // GET COOKIES

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
  };

  // CHECK FOR ACCESS TOKEN

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      setShowUser(true);
    }
  }, [user]); // Empty dependency array ensures this effect runs only once, on mount

  // USER LOADING

  if (userLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-[72px] border-b-2 border-[##EAECF0]  px-4  md:px-8">
      {/* DESKTOP MENU */}
      <div className="hidden sm:flex justify-between items-center relative">
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
        <div>
          <Input
            type="text"
            placeholder="Search"
            className="h-[35px] w-[300px] md:w-[400px]"
          />
        </div>
        {/* BUTTONS */}
        <div className="flex gap-6 md:gap-8 justify-center items-center">
          {/* THREE DOTS */}
          <HiOutlineDotsVertical className="cursor-pointer" />
          {/* LOGIN */}
          {showUser ? (
            <img 
            src={user?.message?.avatar} 
            alt="User Image" 
            className="w-11 h-11 rounded-full bg-cover cursor-pointer "
            onClick={()=>{setModal((prev)=>setModal(!prev))}}
            />
          ) : (
            <>
              <Link to="/login">
                <Button value="Log in" />
              </Link>
              <Link to="/register" className="bg-[#AE7AFF] shadow-custom py-1 px-2">
                <Button value="Sign up" className="text-black" />
              </Link>
            </>
          )}
        </div>
        </div>
        {
          modal && (
              <Modal/>
          )
        }


      {/* MOBILE MENU */}
      <div className="sm:hidden flex justify-between items-center">
        <img src="/Logo/Logo.png" className="w-16 h-16 bg-cover ml-7 " alt="" />
        <div className="flex justify-center items-center gap-2">
          <FiSearch className="text-3xl cursor-pointer" />
          <img
            src="/Logo/Hamburger.png"
            className="w-16 h-16 bg-cover cursor-pointer "
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
