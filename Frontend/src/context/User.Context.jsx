import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const UserContext = createContext();
const BASE_URL = "https://play-jo4f.onrender.com/api/v1/users";

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  const signupUser = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/register`, data);
      return res.data;
    },
  });

  const signinUser = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data) => {
      const res = await axios.post(`http://localhost:4000/api/v1/users/login`, data);
      console.log(res);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const verifiedOTP = useMutation({
    mutationFn: async ({ getOtp, data }) => {
      const res = await axios.post(`${BASE_URL}/verify-email`, {
        otp: getOtp,
        userId: data?._id,
      });
      return res.data;
    },
  });

  const resendOTP = useMutation({
    mutationFn: async ({ data }) => {
      const res = await axios.post(`${BASE_URL}/resend-email`, {
        userId: data?._id,
        email: data?.email,
      });
      return res.data;
    },
  });

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log(document.cookie)
      const res = await axios.get("https://play-jo4f.onrender.com/api/v1/users/me", {
        withCredentials: true,  // Allow cookies to be sent
      });
      console.log(res);
      return res.data;
    },
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  


  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${BASE_URL}/logout`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.removeQueries(["user"]);
      setIsAuthenticated(false);
    },
  });

  const { data: channelData, error: channelError, isLoading: channelLoading } = useQuery({
    queryKey: ["channelProfile", user?.message],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/${user?.message?.username}`);
      console.log(res)
      return res.data;
    },
    enabled: !!user?.message,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  const updateUserDetails = useMutation({
    mutationKey: ["user", "channelProfile"],
    mutationFn: async (data) => {
      const res = await axios.patch(`${BASE_URL}/update-account`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "channelProfile"]);
    },
  });

  const updateUserAvatar = useMutation({
    mutationKey: ["user", "channelProfile"],
    mutationFn: async (data) => {
      const res = await axios.patch(`${BASE_URL}/update-avatar`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "channelProfile"]);
    },
  });

  const updateUserCoverImg = useMutation({
    mutationKey: ["user", "channelProfile"],
    mutationFn: async (data) => {
      const res = await axios.patch(`${BASE_URL}/update-coverImage`, data);
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
        updateUserCoverImg,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
