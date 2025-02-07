import React, { useEffect, useState } from "react";
import { Link, UNSAFE_ServerMode } from "react-router-dom";
import { useUser } from "../context/User.Context";
import Button from "../utils/Button";
import Modal from "./Modal";

const MobileBar = ({setMobileBar}) => {
    const [showUser, setShowUser] = useState(false);
    const { user, userError, userLoading , isAuthenticated } = useUser();
     const [modal, setModal] = useState(false);

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
  return (
   <>
    <div className="bg-black shadow-sm shadow-white flex justify-start  pt-4 flex-col gap-1  w-full h-full">
      <div
        className="flex flex-col justify-center items-start 
        px-4  cursor-pointer"
      >
         <Link
        to="/video/liked-videos"
        className={`text-sm py-1 mb-2 `}>
          Liked Videos
        </Link>
        {/* <span className={`text-lg ${elm?.class}`}>{elm.icon}</span> */}
        <Link 
        to='/video/playlist'
        className={`text-sm py-1 mb-2 `}>
          Playlist Videos
        </Link>
        <Link 
        to='/user/subcribers'
        className={`text-sm py-1 mb-2 `}>
          Community
        </Link>
      </div>
      <div
        className="flex flex-col justify-center items-start 
        px-4  cursor-pointer"
      >
        {/* <span className={`text-lg ${elm?.class}`}>{elm.icon}</span> */}
       
        {user ? (
              <img
                src={user?.message?.avatar}
                alt="User Image"
                className="w-11 h-11 rounded-full bg-cover cursor-pointer "
                onClick={() => {
                  setModal(true); 
                  // setTimeout(() => setMobileBar(false), 300); // 300ms ka delay
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
    {modal && <Modal setModal={setModal} />}

   </>
  );
};

export default MobileBar;
