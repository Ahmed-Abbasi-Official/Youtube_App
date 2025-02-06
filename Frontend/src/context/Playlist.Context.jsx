"use client"

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { createContext, useContext, useMemo, useCallback } from "react"

const PlaylistContext = createContext(null)
const BASE_URL = "/api/v1/playlist"

export const PlaylistProvider = ({ children }) => {
  const queryClient = useQueryClient()

  const fetchPlaylists = useCallback(async () => {
    const res = await axios.get(`${BASE_URL}`)
    return res.data
  }, [])

  const {
    data: playlists,
    isLoading: playlistsLoading,
    error: playlistsError,
  } = useQuery({
    queryKey: ["playlists"],
    queryFn: fetchPlaylists,
  })

  const createPlaylist = useMutation({
    mutationFn: async (playlistName) => {
      const res = await axios.post(
        `${BASE_URL}/create-new-playlist`,
        {
          playlistName,
        },
        {
          withCredentials: true,
        },
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists"])
    },
  })

  const deletePlaylist = useMutation({
    mutationFn: async (playlistId) => {
      const res = await axios.delete(`${BASE_URL}/${playlistId}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists"])
    },
  })

  const togglePlaylistVideo = useMutation({
    mutationFn: async ({ playlist, slug }) => {
      const res = await axios.patch(
        `${BASE_URL}/toggle-playlist/${playlist?._id}`,
        {
          slug,
        },
        {
          withCredentials: true,
        },
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists", "videos"])
    },
  })

  const fetchSinglePlaylist = useCallback(async (id) => {
    const res = await axios.get(`${BASE_URL}/playlist/${id}`)
    return res.data
  }, [])

  const contextValue = useMemo(
    () => ({
      playlists,
      playlistsLoading,
      playlistsError,
      createPlaylist,
      deletePlaylist,
      togglePlaylistVideo,
      fetchSinglePlaylist,
    }),
    [
      playlists,
      playlistsLoading,
      playlistsError,
      createPlaylist,
      deletePlaylist,
      togglePlaylistVideo,
      fetchSinglePlaylist,
    ],
  )

  return <PlaylistContext.Provider value={contextValue}>{children}</PlaylistContext.Provider>
}

export const usePlaylist = () => {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider")
  }
  return context
}

