import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";

const CommentsContext = createContext();
const BASE_URL = "/api/v1/comments";

export const CommentsProvider = ({ children }) => {
  const queryClient = useQueryClient();

    // GET ALL COMMENTS   

  const getComments = async(videoId)=>{
    const res = await axios.get(`${BASE_URL}/${videoId}`);
    // console.log(res)
    return res.data;
  };

    // CREATE COMMENT

  const createComment = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/create-comment`, data, {
        withCredentials: true,  // Allow cookies to be sent
      });
      queryClient.invalidateQueries(["comments"]);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData("comments");
    },
  })

  // LIKED COMMENT

  const likeComment = useMutation({
    mutationFn: async (commentId) => {
      const res = await axios.patch(`${BASE_URL}/like-comment/${commentId}`, null, {
        withCredentials: true,  // Allow cookies to be sent
      });
      queryClient.invalidateQueries(["comments"]);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData("comments");
    },
  })

  // DELETE COMMENT

  const deleteComment = useMutation({
    mutationFn: async (commentId) => {
      const res = await axios.delete(`${BASE_URL}/comment-delete/${commentId}`, {
        withCredentials: true,  // Allow cookies to be sent
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments"]);
    },
  })

  return (
    <CommentsContext.Provider
      value={{

        getComments,
        createComment,
        likeComment,
        deleteComment

      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => useContext(CommentsContext);
