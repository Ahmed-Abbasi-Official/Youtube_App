import { useState } from "react";

export default function SaveModal({ onClose }) {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlists, setPlaylists] = useState(["Ahmed", "Abbasi"]);

  // HANDLE CHANGE CHECK BOX

  const handleCheckboxChange = (playlist) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlist)
        ? prev.filter((p) => p !== playlist)
        : [...prev, playlist]
    );
  };

  // HANDLE CREATE PLAYLIST

  const handleCreatePlaylist = () => {
    setPlaylists((prev)=>(
        [...prev , playlistName]
    ))
    console.log("Selected playlists:", selectedPlaylists);
    // onClose()
  };

  // HANDLE REMOVE PLAYLIST

  const handleRemovePlaylist = (playlist) => {
    const updatedPlaylists = playlists.filter((p) => p !== playlist);
    console.log(updatedPlaylists);
    setPlaylists(updatedPlaylists); // Update the state
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 bg-black">
      <div className="relative bg-black rounded-lg w-full max-w-md p-6 shadow-lg border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Save To playlist</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => {
              onClose(false);
            }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div key={playlist} className="flex items-center space-x-2 ">
              <input
                type="checkbox"
                id={playlist}
                checked={selectedPlaylists.includes(playlist)}
                onChange={() => handleCheckboxChange(playlist)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <label htmlFor={playlist} className="text-white font-medium">
                {playlist}
              </label>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  handleRemovePlaylist(playlist);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

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
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition duration-200 ease-in-out"
            onClick={handleCreatePlaylist}
          >
            Create new Playlist
          </button>
        </div>
      </div>
    </div>
  );
}
