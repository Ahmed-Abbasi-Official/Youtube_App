import { Search } from "lucide-react";
import React from "react";

const HistorySearchBar = () => {
  return (
    <div className="flex relative">
      <input
        type="search"
        placeholder="Search"
        className="w-full bg-black   py-2 px-4 pl-10 outline-none border-b border-white/50 focus:border-white "
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default HistorySearchBar;
