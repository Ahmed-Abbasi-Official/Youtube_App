import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track auth status
  const queryClient = useQueryClient();

  // SIGNUP USER
  const signupUser = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/api/v1/users/register", data);
      // console.log(res);

      return res.data;
    },
  });

  // SIGNIN USER

  const signinUser = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data) => {
      const res = await axios.post("/api/v1/users/login", data);
      console.log(res);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]); // Refresh user data
    },
  });

  // VERIFY OTP

  const verifiedOTP = useMutation({
    mutationFn: async ({ getOtp, data }) => {
      const userId = data?._id;
      const otp = getOtp;
      // console.log(otp,userId)
      const res = await axios.post("/api/v1/users/verify-email", {
        otp,
        userId,
      });
      // console.log(res)
      return res.data;
    },
  });

  // RESEND OTP

  const resendOTP = useMutation({
    mutationFn: async ({ data }) => {
      const email = data?.email;
      const userId = data?._id;
      // console.log(email,userId)
      const res = await axios.post("/api/v1/users/resend-email", {
        userId,
        email,
      });
      // console.log(res)
      return res.data;
    },
  });

  // GET CURRENT USER

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/users/me");
      return res.data;
    },
    retry: false, // Prevent retry on failure
    staleTime: Infinity, // Data is considered fresh indefinitely, preventing unnecessary refetches
    cacheTime: Infinity, // Cache will persist indefinitely
  });

  // LOGOUT

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/v1/users/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.removeQueries(["user"]);
      setIsAuthenticated(false); // Set unauthenticated status when logged out
    },
  });

  return (
    <UserContext.Provider
      value={{
        signupUser,
        verifiedOTP,
        signinUser,
        resendOTP,
        user,
        userError,
        userLoading,
        logoutMutation,
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
