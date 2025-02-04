import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";

const VideoContext = createContext();
const BASE_URL = "/api/v1/videos";

export const VideoProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [abortController, setAbortController] = useState(null);

  // UPLOAD VIDEO

  const uploadVideo = useMutation({
    mutationFn: async (data) => {
      const controller = new AbortController(); // Create abort controller
      setAbortController(controller); // Save controller
      const res = await axios.post(`${BASE_URL}/upload-video`,data,{
        withCredentials:true,
        signal: controller.signal, // Pass signal for cancellation
      });
      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["videos"]) ;
    }
  })
  
   // ✅ CANCEL UPLOADING 

   const cancelUpload = () => {
    if (abortController) {
      abortController.abort(); // Cancel request
      uploadVideo.reset(); // Reset mutation state
      console.log("Upload cancelled.");
    }
  };

  // GET ALL VIDEOS

  const {data:allVideos , error:allVideosError , isLoading:allVideosLoading} = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}`);
      return res.data;
    },
    retry: false, // Prevent retry on failure
    staleTime: Infinity, // Data is considered fresh indefinitely, preventing unnecessary refetches
    cacheTime: Infinity, // Cache will persist indefinitely
  });

   // GET USER VIDEO   

  const userVideos = useMutation({
    mutationFn: async (username) => {
      // console.log(username)
      const res = await axios.get(`${BASE_URL}/user/${username}`);
      return res.data;
    },
  })

  // GET SINGLE VIDEOS

  const fetchSingleVideo = async (slug) => {
    const res = await axios.get(`${BASE_URL}/${slug}`);
    return res.data;
  };

  // DELETE VIDEO

  const deleteVideo = useMutation({
    mutationFn: async (videoId) => {
      const res = await axios.delete(`${BASE_URL}/${videoId}`);
      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["videos"]) ;
    }
  })

  // UPDATE VIDEO

  const updateVideo = useMutation({
    mutationFn: async ({ videoId, data }) => {
      const res = await axios.patch(`${BASE_URL}/user/update/${videoId}`, data, {
        withCredentials: true,
        // signal: controller.signal,
      });
      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["videos"]) ;
    }
  })

  // GET DASHBOARD

  const dashboardData = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/dashboard/data`,{
        withCredentials: true,
      });
      // console.log(res.data)
      return res.data;
    },
    retry: false, // Prevent retry on failure
    staleTime: Infinity, // Data is considered fresh indefinitely, preventing unnecessary refetches
    cacheTime: Infinity, // Cache will persist indefinitely
  })

  // TOGGLE SUBSCRIPTION

  const toggleSubscription = useMutation({
    mutationFn: async ({videoId}) => {
      const channelId = videoId
      console.log(channelId)
      const res = await axios.get(`${BASE_URL}/subscription/${channelId}`);
      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["dashboard","videos"]) ;
    }
  })

  // UNSUBS

  const unsubscribe = useMutation({
    mutationFn: async (channelId) => {
      const res = await axios.post(`${BASE_URL}/unsubscription/${channelId}`,{
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["dashboard","videos","user"]) ;
    }
  })

  // SUBS

  const subscribe = useMutation({
    mutationFn: async (channelId) => {
      const res = await axios.post(`${BASE_URL}/subscription/${channelId}`,{
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["dashboard","videos","user"]) ;
    }
  })

  // LIKED VIDEOS USER

  const fetchUserLikedVideos = async ()=>{
    const res = await axios.post(`${BASE_URL}/liked`,{
      withCredentials: true,
    });
    return res.data;
  }

  return <VideoContext.Provider value={{

    allVideos,
    allVideosError,
    allVideosLoading,
    userVideos,
    uploadVideo,
    cancelUpload,
    fetchSingleVideo,
    deleteVideo,
    updateVideo,
    dashboardData,
    toggleSubscription,
    fetchUserLikedVideos,
    unsubscribe,
    subscribe

  }}>{children}</VideoContext.Provider>;
};

export const useVideo = () => useContext(VideoContext);
