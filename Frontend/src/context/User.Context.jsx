import axios from "axios";
import { createContext, useContext, useState } from "react";
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

  // GET CHANNEL PROFILE

  const { data:channelData, error:channelError, isLoading:channelLoading } = useQuery({
    queryKey: ["channelProfile", user?.message],
    queryFn: async ()=>{
      const res = await axios.get(`/api/v1/users/${user?.message?.username}`);
      return res.data;
    },
    enabled: !!user?.message,  // Tabhi chale jab user.message ho
    retry: 2,                  // 2 dafa retry kare ga agar fail ho
    staleTime: 1000 * 60 * 5,   // 5 minutes tak cache fresh rahe ga
  });

  // USER DETAILS UPDATE

  const updateUserDetails = useMutation({
    mutationKey: ["user","channelProfile"],
    mutationFn: async (data) => {
      const res = await axios.patch(`/api/v1/users/update-account`, data);
      // console.log(res);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user,channelProfile"]); // Refresh user data
    },
    enabled:!!user, // Tabhi chale jab user ho
  })

  // UPDATE USER AVATAR PICTURE

  const updateUserAvatar = useMutation({
    mutationKey: ["user", "channelProfile"],
    mutationFn: async (data) => {
      console.log(data)
      const res = await axios.patch(`/api/v1/users/update-avatar`, data);
      console.log(res);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "channelProfile"]);
    },
  });

  // UPDATE COVER IMAGE

  const updateUserCoverImg = useMutation({
    mutationKey: ["user", "channelProfile"],
    mutationFn: async (data) => {
      // console.log(data)
      const res = await axios.patch(`/api/v1/users/update-coverImage`, data);
      console.log(res);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "channelProfile"]);
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
        setIsAuthenticated,
        channelData,
        channelError,
        channelLoading,
        updateUserDetails,
        updateUserAvatar,
        updateUserCoverImg

      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
