import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { createContext, useContext, useState, useMemo, useCallback } from "react"

const VideoContext = createContext(null)
const BASE_URL = "https://play-lgud.onrender.com/api/v1/videos"

export const VideoProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const [abortController, setAbortController] = useState(null)

  const uploadVideo = useMutation({
    mutationFn: async (data) => {
      const controller = new AbortController()
      setAbortController(controller)
      const res = await axios.post(`${BASE_URL}/upload-video`, data, {
        withCredentials: true,
        signal: controller.signal,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"])
    },
  })

  const cancelUpload = useCallback(() => {
    if (abortController) {
      abortController.abort()
      uploadVideo.reset()
      console.log("Upload cancelled.")
    }
  }, [abortController, uploadVideo])

  const {
    data: allVideos,
    error: allVideosError,
    isLoading: allVideosLoading,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}`)
      return res.data
    },
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    cacheTime: Number.POSITIVE_INFINITY,
  })

  const userVideos = useMutation({
    mutationFn: async (username) => {
      const res = await axios.get(`${BASE_URL}/user/${username}`)
      return res.data
    },
  })

  const fetchSingleVideo = useCallback(async (slug) => {
    const res = await axios.get(`${BASE_URL}/${slug}`)
    return res.data
  }, [])

  const deleteVideo = useMutation({
    mutationFn: async (videoId) => {
      const res = await axios.delete(`${BASE_URL}/${videoId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"])
    },
  })

  const updateVideo = useMutation({
    mutationFn: async ({ videoId, data }) => {
      const res = await axios.patch(`${BASE_URL}/user/update/${videoId}`, data, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"])
    },
  })

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/dashboard/data`, {
        withCredentials: true,
      })
      return res.data
    },
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    cacheTime: Number.POSITIVE_INFINITY,
  })

  const toggleSubscription = useMutation({
    mutationFn: async ({ videoId }) => {
      const channelId = videoId
      const res = await axios.get(`${BASE_URL}/subscription/${channelId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard", "videos"])
    },
  })

  const unsubscribe = useMutation({
    mutationFn: async (channelId) => {
      const res = await axios.post(`${BASE_URL}/unsubscription/${channelId}`, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard", "videos", "user"])
    },
  })

  const subscribe = useMutation({
    mutationFn: async (channelId) => {
      const res = await axios.post(`${BASE_URL}/subscription/${channelId}`, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard", "videos", "user"])
    },
  })

  const fetchUserLikedVideos = useCallback(async () => {
    const res = await axios.post(`${BASE_URL}/liked`, {
      withCredentials: true,
    })
    return res.data
  }, [])

  const searchVideos = useCallback(async (query) => {
    const res = await axios.get(`${BASE_URL}/videos/search?q=${query}`)
    return res.data
  }, [])

  const fetchVideosByCategory = useCallback(async (category) => {
    const res = await axios.get(`${BASE_URL}/videos/category/${category}`)
    return res.data
  }, [])

  const contextValue = useMemo(
    () => ({
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
      subscribe,
      searchVideos,
      fetchVideosByCategory,
    }),
    [
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
      subscribe,
      searchVideos,
      fetchVideosByCategory,
    ],
  )

  return <VideoContext.Provider value={contextValue}>{children}</VideoContext.Provider>
}

export const useVideo = () => {
  const context = useContext(VideoContext)
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider")
  }
  return context
}

