import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();
const BASE_URL = "/api/v1/playlist";

export const PlaylistProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // FETCH PLAYLISTS

  const fetchPlaylists = async () => {
    const res = await axios.get(`${BASE_URL}`);
    // console.log(res);
    return res.data;
  };

  // CREATE PLAYLISTS

  const createPlaylist = useMutation({
    mutationFn: async (playlistName) => {
      const res = await axios.post(`${BASE_URL}/create-new-playlist`, {
        playlistName,
      },{
        withCredentials: true,
      });
      return res.data;
    },
  });

  // DELETE PLAYLIST

  const deletePlaylist=useMutation({
    mutationFn: async (playlistId) => {
      const res = await axios.delete(`${BASE_URL}/${playlistId}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["playlist"]);
    },
  })

  // TOGGLE PLAYLIST VIDEO

  const togglePlaylistVideo = useMutation({
    mutationFn: async ({playlist, slug}) => {
      // console.log(playlist , slug)
      const res = await axios.patch(`${BASE_URL}/toggle-playlist/${playlist?._id}`, {
        slug,
      },{
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["playlist" , "videos"]);
    },
  })

  return (
    <PlaylistContext.Provider
      value={{
        createPlaylist,
        fetchPlaylists,
        deletePlaylist,
        togglePlaylistVideo
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
