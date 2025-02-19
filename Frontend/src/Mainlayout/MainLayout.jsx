import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUser } from "../context/User.Context";
import Loader from "../components/Loader";

const MainLayout = () => {
  const { setIsAuthenticated, user, userLoading } = useUser();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false)
    }
  }, [user]);

  // if (userLoading) return <Loader />;



  return (
    <div className="bg-[#000] text-white w-full h-[100vh]">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
