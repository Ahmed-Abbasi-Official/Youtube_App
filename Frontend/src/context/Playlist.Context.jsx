import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Axis3D } from "lucide-react";
import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();
const BASE_URL = "https://play-lgud.onrender.com/api/v1/playlist";

export const PlaylistProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // FETCH PLAYLISTS

  const fetchPlaylists = async () => {
    const res = await axios.get(`${BASE_URL}`, {
      withCredentials: true, // Allow cookies to be sent
    });
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
      const res = await axios.delete(`${BASE_URL}/${playlistId}`,{
        withCredentials: true,
      });
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

  // GET SINGLE PLAYLIST

  const fetchSinglePlaylist = async (id)=>{
      const res = await axios.get(`${BASE_URL}/playlist/${id}`, {
        withCredentials: true, // Allow cookies to be sent
      })
      return res.data;
  } 



  return (
    <PlaylistContext.Provider
      value={{
        createPlaylist,
        fetchPlaylists,
        deletePlaylist,
        togglePlaylistVideo,
        fetchSinglePlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
