import React from "react";

const SearchDataTable = ({
  perPage,
  setPerPage,
  searchValue,
  setSearchValue,
  perPageOptions = [5, 10, 25],
}) => {
  return (
    <div className="items-center flex w-full h-[80px]">
      <div className="hidden md:flex justify-between w-full gap-4 px-2">
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="px-3 py-2 bg-[#edf5f5] outline-none border border-gray-200 rounded-md text-sm"
        >
          {perPageOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#edf5f5] outline-none border border-gray-200 rounded-md text-sm"
          type="text"
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default SearchDataTable;
