"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { createContext, useContext, useMemo, useCallback } from "react"

const CommentsContext = createContext(null)
const BASE_URL = "/api/v1/comments"

export const CommentsProvider = ({ children }) => {
  const queryClient = useQueryClient()

  const getComments = useCallback(async (videoId) => {
    const res = await axios.get(`${BASE_URL}/${videoId}`)
    return res.data
  }, [])

  const createComment = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/create-comment`, data, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"])
    },
  })

  const likeComment = useMutation({
    mutationFn: async (commentId) => {
      const res = await axios.patch(`${BASE_URL}/like-comment/${commentId}`, null, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"])
    },
  })

  const deleteComment = useMutation({
    mutationFn: async (commentId) => {
      const res = await axios.delete(`${BASE_URL}/comment-delete/${commentId}`, {
        withCredentials: true,
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"])
    },
  })

  const contextValue = useMemo(
    () => ({
      getComments,
      createComment,
      likeComment,
      deleteComment,
    }),
    [getComments, createComment, likeComment, deleteComment],
  )

  return <CommentsContext.Provider value={contextValue}>{children}</CommentsContext.Provider>
}

export const useComments = () => {
  const context = useContext(CommentsContext)
  if (!context) {
    throw new Error("useComments must be used within a CommentsProvider")
  }
  return context
}

