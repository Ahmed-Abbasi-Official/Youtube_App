import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const UserContext = createContext();
const BASE_URL = "https://play-lgud.onrender.com/api/v1/users";

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // SIGN USER

  const signupUser = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/register`, data);
      return res.data;
    },
  });

  // SIGNUP USER

  const signinUser = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/login`, data,{ withCredentials: true });
      // console.log(res);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  // VERIFIED USER

  const verifiedOTP = useMutation({
    mutationFn: async ({ getOtp, data }) => {
      const res = await axios.post(`${BASE_URL}/verify-email`, {
        otp: getOtp,
        userId: data?._id,
      });
      return res.data;
    },
  });

  // RESEND OTP

  const resendOTP = useMutation({
    mutationFn: async ({ data }) => {
      const res = await axios.post(`${BASE_URL}/resend-email`, {
        userId: data?._id,
        email: data?.email,
      });
      return res.data;
    },
  });

  // GET USER

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // console.log(document.cookie)
      const res = await axios.get(`${BASE_URL}/me`, { withCredentials: true });
      // console.log("res");
      return res.data;
    },
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // LOGOUT USER

  const logoutMutation = useMutation({
    mutationFn: async (id) => {
      console.log(id)
      const res = await axios.post(`${BASE_URL}/logout`,{userId:id}, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.invalidateQueries(["user"]);
      queryClient.removeQueries(["user"]);
    },
  });

  // CHANNEL DATA

  const channelDataAPI = async (username) => {
    const res  = await axios.get(`${BASE_URL}/user/${username}`);
    return res.data
  };

  // UPDATE USER

  const updateUserDetails = useMutation({
    mutationKey: ["user", "channelProfile"],
    mutationFn: async (data) => {
      const res = await axios.patch(`${BASE_URL}/update-account`, data, {
        withCredentials: true, // Allow cookies to be sent
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "channelProfile"]);
    },
  });

  // UPDATE AVATAR

  const updateUserAvatar = useMutation({
    mutationKey: ["user", "channelProfile"],
    mutationFn: async (data) => {
      const res = await axios.patch(`${BASE_URL}/update-avatar`, data, {
        withCredentials: true, // Allow cookies to be sent
      });
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
      const res = await axios.patch(`${BASE_URL}/update-coverImage`, data, {
        withCredentials: true, // Allow cookies to be sent
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "channelProfile"]);
    },
  });

  // LIKED VIDEOS

  const likedVideos = useMutation({
    mutationKey: ["likedVideos", user?.message],
    mutationFn: async (video) => {
      const videoId = video?._id;
      const res = await axios.post(
        `${BASE_URL}/liked-video`,
        { videoId },
        {
          withCredentials: true, // Allow cookies to be sent
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likedVideos", "user"]);
    },
  });

  // DISLIKED VIDEOS

  const dislikedVideos = useMutation({
    mutationKey: ["dislikedVideos", user?.message],
    mutationFn: async (video) => {
      const videoId = video?._id;
      const res = await axios.post(
        `${BASE_URL}/dis-liked-video`,
        { videoId },
        {
          withCredentials: true, // Allow cookies to be sent
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dislikedVideos", "user"]);
    },
  });

    // GET HISTORY

    const getHistory = async ()=>{
      const res = await axios.get(`${BASE_URL}/history`, { withCredentials: true })
      return res.data;
    }

    // DELETE HISTORY

    const deleteHistory = useMutation({
      mutationFn: async (playlistId) => {
        const res = await axios.delete(`${BASE_URL}/history/${playlistId}`, { withCredentials: true })
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["history"]);
      }
    })

    // DELETE ALL HISTORY

    const deleteAllHistory = useMutation({
      mutationFn: async () => {
        const res = await axios.get(`${BASE_URL}/history/all`, { withCredentials: true })
        // console.log(res)
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["history"]);
      }
    })

    // PAUSE HISTORY

    const pauseHistory = useMutation({
      mutationFn: async () => {
        const res = await axios.patch(`${BASE_URL}/history/pause`)
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["history"]);
      }
    })

    // GET COMMUNITY

    const getCommunity = async () => {
      const res = await axios.get(`${BASE_URL}/community`, {
        withCredentials: true, // Allow cookies to be sent
      })
      return res.data;
    };


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
        channelDataAPI,
        updateUserDetails,
        updateUserAvatar,
        updateUserCoverImg,
        likedVideos,
        dislikedVideos,
        getHistory,
        deleteHistory,
        deleteAllHistory,
        pauseHistory,
        getCommunity
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
