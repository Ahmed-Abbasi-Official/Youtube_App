import React, { useEffect, useState } from "react";
import { useVideo } from "../context/Videos.Context";
import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [showsuggestions,setShowsuggestions]=useState(false);
  const { searchVideos } = useVideo();
  const navigate = useNavigate();

  // HANDLE SEARCH CHANGE

  const handleChange = (e) => {
    setSearch(e.target.value);
    setShowsuggestions(true);
  };

//   GET SEARCH VIDEOS
  const {
    data: suggestions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", search],
    queryFn: () => searchVideos(search),
    enabled: !!search, // Query sirf tab chale jab query ho
  });

  useEffect(() => {
    if(search==""){
        setShowsuggestions(false)
    }
  
  }, [search])
  
  


  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        autoComplete="off"
        className="bg-black px-4 py-1 border border-[#D0D5DD] rounded-none text-white outline-none h-[35px] w-[300px] md:w-[400px]"
        value={search}
        onChange={handleChange}
      />
      {
        showsuggestions && (
            <div className="w-full mt-8 bg-[#0f0f0f] top-2 rounded-lg  h-[400px] z-20 absolute">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {suggestions?.message?.length === 0 && <div>No suggestions found.</div>}
        {!error &&
          !isLoading &&
          suggestions?.message?.length > 0 &&
          suggestions?.message?.map((video) => (
            <>
              <div
                key={video._id}
                className="py-2 flex items-center gap-2 px-2 text-white font-semibold text-xs md:text-sm"
              >
                <FiSearch className="w-4 h-4 cursor-pointer" />
                <span
                  onClick={() => {
                    navigate(`/video/${video?.slug}`);
                  }}
                  className="cursor-pointer"
                >
                  {video?.title}
                </span>
              </div>
              <div className="w-[95%] shadow-sm shadow-white mx-auto h-[1px] bg-red-400"></div>
            </>
          ))}
      </div>
        )
      }
    </div>
  );
};

export default SearchBar;
