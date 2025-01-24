import React, { useContext } from "react";
import filtersContext from "../../contexts/filters/filterContext";

const FilterBarOptions = () => {
  const {
    sortedValue,
    setSortedValue,
    handlePrice,
    selectedPrice: { price, minPrice, maxPrice },
    mobFilterBar: { isMobSortVisible, isMobFilterVisible },
    handleMobSortVisibility,
    handleMobFilterVisibility,
    handleClearFilters,
  } = useContext(filtersContext);
  
  const sortMenu = [
    {
      id: 1,
      title: "Latest",
    },
    {
      id: 2,
      title: "Price(Lowest First)",
    },
    {
      id: 3,
      title: "Price(Highest First)",
    },
  ];

  return (
    <>
      {/*===== Clear-Filters btn =====*/}
      {(sortedValue || price !== maxPrice) && (
        // clear_filter_btn
        <div className="">
          <button
            type="button"
            className="w-full bg-blue-3 text-white-1 px-4 py-3 rounded-[8px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-6 active:bg-blue-6 max-lg:mt-5"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="max-lg:grid max-lg:grid-cols-2 gap-5">
        {/*===== Sort-menu =====*/}
        <div
          className={`w-full py-8 bg-white max-lg:col-span-1 ${isMobSortVisible ? "block" : ""}`}
        >
          {/* sort_head */}
          <div className="max-lg:flex max-lg:justify-between max-lg:items-center flex justify-between">
            <h3>Sort By</h3>
            {/* close_btn */}
            <button
              type="button"
              className="text-[2rem] leading-5 cursor-pointer inline-block"
              onClick={() => handleMobSortVisibility(false)}
            >
              &times;
            </button>
          </div>

          <div className="mt-4 mb-4 border-t-[1px] border-grey-2"></div>

          <ul className="space-y-4">
            {sortMenu.map((item) => {
              const { id, title } = item;
              return (
                <li
                  key={id}
                  className={`cursor-pointer transition-colors duration-200 ${
                    sortedValue === title
                      ? "text-blue-8 font-bold"
                      : "hover:text-blue-8"
                  }`}
                  onClick={() => setSortedValue(title)}
                >
                  {title}
                </li>
              );
            })}
          </ul>
        </div>

        {/*===== Filter-menu =====*/}
        <div
          className={`w-full py-8 bg-white max-lg:col-span-1 ${
            isMobFilterVisible ? "block" : "inline-block"
          }`}
        >
          <div className="max-lg:flex max-lg:justify-between max-lg:items-center flex justify-between">
            <h3>Filter By</h3>
            <button
              type="button"
              className="text-[2rem] leading-5 cursor-pointer inline-block"
              onClick={() => handleMobFilterVisibility(false)}
            >
              &times;
            </button>
          </div>

          <div className="mt-4 mb-4 border-t-[1px] border-grey-2"></div>

          {/* Filter by Price */}
          <div className="mb-10 last:mb-0">
            <h4>Price</h4>
            <div>
              <p className="font-semibold mb-2">₹ {price}</p>
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={price}
                onChange={handlePrice}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterBarOptions;
