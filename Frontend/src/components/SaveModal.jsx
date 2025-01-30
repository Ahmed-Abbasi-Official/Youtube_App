import { useEffect, useState } from "react";
import { usePlaylist } from "../context/Playlist.Context";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SaveModal({ onClose }) {
  const { createPlaylist, fetchPlaylists, deletePlaylist, togglePlaylistVideo } = usePlaylist();
  
  // GET ALL PLAYLISTS
  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ["playlist"],
    queryFn: fetchPlaylists,
  });

  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const { slug } = useParams();
  const queryClient = useQueryClient();


  if (isLoading) {
    return <p className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2">Loading...</p>;
  }

  // HANDLE CHECKBOX CHANGE
  const handleCheckboxChange = async (playlist) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlist._id)
        ? prev.filter((id) => id !== playlist._id)
        : [...prev, playlist._id]
    );

    await togglePlaylistVideo.mutate(
      { playlist, slug },
      {
        onSuccess: (updatedData) => {
          onClose(false)
          toast.success(updatedData?.data);
          queryClient.invalidateQueries(["playlist"]);
        },
        onError: (error) => {
          onClose(false)
          toast.error(error?.response?.data?.message);
        },
      }
    );
  };

  // HANDLE CREATE PLAYLIST
  const handleCreatePlaylist = async () => {
    await createPlaylist.mutate(playlistName, {
      onSuccess: (data) => {
        setPlaylistName("");
        console.log(data)
        queryClient.invalidateQueries(["playlist"]);
        toast.success(data?.data);
      },
      onError: (error) => {
        console.log(error)
        toast.error(error?.response?.data?.message);
      },
    });
  };

  // HANDLE REMOVE PLAYLIST
  const handleRemovePlaylist = async (playlist) => {
    await deletePlaylist.mutate(playlist._id, {
      onSuccess: (data) => {
        toast.success(data?.data);
        queryClient.invalidateQueries(["playlist"]);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 bg-black">
      <div className="relative bg-black rounded-lg w-full max-w-md p-6 shadow-lg border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Save To Playlist</h2>
          <button className="text-gray-400 hover:text-white" onClick={() => onClose(false)}>
            ✕
          </button>
        </div>

        {/* PLAYLIST LIST */}
        <div className="space-y-4">
          {playlist?.message &&
            playlist.message.map((playlist) => (
              <div key={playlist._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={playlist._id}
                  checked={playlist?.slug ===slug ||selectedPlaylists.includes(playlist._id)}
                  onChange={() => handleCheckboxChange(playlist)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <label htmlFor={playlist.playlistName} className="text-white font-medium">
                  {playlist.playlistName}
                </label>
                <button
                  className="text-gray-400 hover:text-white"
                  disabled={deletePlaylist?.isPending}
                  onClick={() => handleRemovePlaylist(playlist)}
                >
                  {"✕"}
                </button>
              </div>
            ))}

          {deletePlaylist?.isPending && (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-black/50">Deleting...</p>
          )}
        </div>

        {/* CREATE NEW PLAYLIST */}
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="playlist-name" className="block text-gray-400">
              Name
            </label>
            <input
              id="playlist-name"
              type="text"
              placeholder="Enter playlist name"
              value={playlistName}
              required
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition duration-200 ease-in-out"
            onClick={handleCreatePlaylist}
          >
            {createPlaylist?.isPending ? "Creating..." : "Create new Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
