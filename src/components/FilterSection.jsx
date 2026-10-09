import React from "react";
import { useData } from "../context/DataContext";
export default function FilterSection({
  search,
  setSearch,
  category,
  brand,
  priceRange,
  setPriceRange,
  handleCategoryChange,
  handleBrandChange,
  setBrand,
  setCategory
}) {
  const { categoryOnlyData, brandOnlyData } = useData();
  return (
    <div className="bg-gray-100 mt-10 p-4 rounded-md h-max">
      {" "}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white p-2 rounded-md border-gray-400 border-2"
      />{" "}
      {/* Filter section*/}{" "}
      <h1 className="mt-5 font-semibold text-xl">Category</h1>{" "}
      <div className=" flex flex-col gap-2 mt-3">
        {" "}
        {categoryOnlyData?.map((item, index) => {
          return (
            <div key={index} className="flex  gap-2">
              {" "}
              <label className="flex gap-2 cursor-pointer">
                {" "}
                <input
                  type="checkbox"
                  name={item}
                  checked={category === item}
                  onChange={() => handleCategoryChange(item)}
                />{" "}
                <span>{item}</span>{" "}
              </label>{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
      {/*Brand */} <h1 className="mt-5 font-semibold text-xl">Brand</h1>{" "}
      <select
        name=""
        id=""
        value={brand}
        onChange={(e) => handleBrandChange(e.target.value)}
      >
        {" "}
        {brandOnlyData?.map((item, index) => {
          return (
            <option
              key={index}
              value={item}
              className="text-gray-700 text-sm font-medium cursor-pointer hover:text-gray-500 transition duration-300"
            >
              {" "}
              {item}{" "}
            </option>
          );
        })}{" "}
      </select>{" "}
      {/* Price range */}{" "}
      <h1 className="mt-5 font-semibold text-xl mb-3">Price Range</h1>{" "}
      <div className="flex flex-col gap-2">
        {" "}
        <label htmlFor="">
          {" "}
          Price Range: ${priceRange[0]} - ${priceRange[1]}{" "}
        </label>{" "}
        <input
          type="range"
          min="0"
          max="4000"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
        />{" "}
      </div>{" "}
      <button className="bg-red-500 text-white rounded-md px-3 py-1 mt-5 cursor-pointer"
        onClick={() => {
          setSearch("");
          setCategory("All");
          setBrand("All");
          setPriceRange([0, 4000]);
        }}
      >
        {" "}
        Reset Filters{" "}
      </button>{" "}
    </div>
  );
}
