import axios from "axios"
import { createContext, useContext, useState, useCallback, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const UserContext = createContext(null)
const BASE_URL = "/api/v1/users"

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const queryClient = useQueryClient()

  const signupUserMutation = useMutation({
    mutationFn: (data) => axios.post(`${BASE_URL}/signup`, data),
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const signupUser = (data) => {
    signupUserMutation.mutate(data)
  }

  const verifiedOTPMutation = useMutation({
    mutationFn: (data) => axios.post(`${BASE_URL}/verify-otp`, data),
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const verifiedOTP = (data) => {
    verifiedOTPMutation.mutate(data)
  }

  const signinUserMutation = useMutation({
    mutationFn: (data) => axios.post(`${BASE_URL}/signin`, data),
    onSuccess: (data) => {
      setIsAuthenticated(true)
      queryClient.setQueryData(["user"], data.data)
    },
  })

  const signinUser = (data) => {
    signinUserMutation.mutate(data)
  }

  const resendOTPMutation = useMutation({
    mutationFn: (data) => axios.post(`${BASE_URL}/resend-otp`, data),
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const resendOTP = (data) => {
    resendOTPMutation.mutate(data)
  }

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => axios.get(`${BASE_URL}/profile`).then((res) => res.data),
    enabled: isAuthenticated,
  })

  const logoutMutation = useMutation({
    mutationFn: () => axios.post(`${BASE_URL}/logout`),
    onSuccess: () => {
      setIsAuthenticated(false)
      queryClient.removeQueries(["user"])
    },
  })

  const channelDataAPI = useCallback(async (id) => {
    const { data } = await axios.get(`/api/v1/channels/${id}`)
    return data
  }, [])

  const updateUserDetailsMutation = useMutation({
    mutationFn: (data) => axios.put(`${BASE_URL}/update-details`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"])
    },
  })

  const updateUserDetails = (data) => {
    updateUserDetailsMutation.mutate(data)
  }

  const updateUserAvatarMutation = useMutation({
    mutationFn: (data) => axios.put(`${BASE_URL}/update-avatar`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"])
    },
  })

  const updateUserAvatar = (data) => {
    updateUserAvatarMutation.mutate(data)
  }

  const updateUserCoverImgMutation = useMutation({
    mutationFn: (data) => axios.put(`${BASE_URL}/update-cover-img`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"])
    },
  })

  const updateUserCoverImg = (data) => {
    updateUserCoverImgMutation.mutate(data)
  }

  const { data: likedVideos } = useQuery({
    queryKey: ["likedVideos"],
    queryFn: () => axios.get(`${BASE_URL}/liked-videos`).then((res) => res.data),
    enabled: isAuthenticated,
  })

  const { data: dislikedVideos } = useQuery({
    queryKey: ["dislikedVideos"],
    queryFn: () => axios.get(`${BASE_URL}/disliked-videos`).then((res) => res.data),
    enabled: isAuthenticated,
  })

  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["history"],
    queryFn: () => axios.get(`${BASE_URL}/history`).then((res) => res.data),
    enabled: isAuthenticated,
  })

  const deleteHistoryMutation = useMutation({
    mutationFn: (id) => axios.delete(`${BASE_URL}/history/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["history"])
    },
  })

  const deleteHistory = (id) => {
    deleteHistoryMutation.mutate(id)
  }

  const deleteAllHistoryMutation = useMutation({
    mutationFn: () => axios.delete(`${BASE_URL}/history`),
    onSuccess: () => {
      queryClient.invalidateQueries(["history"])
    },
  })

  const deleteAllHistory = () => {
    deleteAllHistoryMutation.mutate()
  }

  const pauseHistoryMutation = useMutation({
    mutationFn: (id) => axios.put(`${BASE_URL}/history/${id}/pause`),
    onSuccess: () => {
      queryClient.invalidateQueries(["history"])
    },
  })

  const pauseHistory = (id) => {
    pauseHistoryMutation.mutate(id)
  }

  const {
    data: community,
    isLoading: communityLoading,
    error: communityError,
  } = useQuery({
    queryKey: ["community"],
    queryFn: () => axios.get(`${BASE_URL}/community`).then((res) => res.data),
    enabled: isAuthenticated,
  })

  const getHistory = history
  const getCommunity = community

  const contextValue = useMemo(
    () => ({
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
      getCommunity,
    }),
    [
      signupUser,
      verifiedOTP,
      signinUser,
      resendOTP,
      user,
      userError,
      userLoading,
      logoutMutation,
      isAuthenticated,
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
      getCommunity,
      setIsAuthenticated,
    ],
  )

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

