import React, { useContext, useRef, useEffect, useState } from "react";
import { BiSort, BiFilterAlt } from "react-icons/bi";
import filtersContext from "../../contexts/filters/filterContext";
import FilterBarOptions from "./FilterBarOptions";

const FilterBar = () => {
  const { handleMobSortVisibility, handleMobFilterVisibility } =
    useContext(filtersContext);
  const footerRef = useRef(null); // Reference for footer
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting); // Update visibility
      },
      {
        root: null, // Observe in the viewport
        threshold: 0.1, // Trigger when 10% of the footer is visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current); // Observe the footer
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current); // Cleanup
      }
    };
  }, []);

  return (
    <>
      {/* Default FilterBar */}
      <aside
        id="filterbar"
        className="p-6 max-h-[82vh] overflow-y-auto max-lg:hidden"
      >
        <div className="grid gap-10 text-sm">
          <FilterBarOptions />
        </div>
      </aside>

      {/* Mobile FilterBar */}
      {!isFooterVisible && ( // Hide FilterBar if footer is visible
        <div
          id="filterbar_mob"
          className="fixed z-[99] bottom-0 left-0 w-full p-4 bg-white-1 shadow-[0_-8px_15px_rgba(0,0,0,0.5)] lg:hidden max-h-[30vh] overflow-y-scroll"
        >
          <div className="flex justify-around items-center text-sm">
            <h3
              className="flex items-center cursor-pointer"
              onClick={() => handleMobSortVisibility(true)}
            >
              <BiSort className="w-5 h-5" />
              <span className="ml-2">Sort</span>
            </h3>
            <span>|</span>
            <h3
              className="flex items-center cursor-pointer"
              onClick={() => handleMobFilterVisibility(true)}
            >
              <BiFilterAlt className="w-5 h-5" />
              <span className="ml-2">Filter</span>
            </h3>
          </div>
          <FilterBarOptions />
        </div>
      )}

      {/* Footer reference */}
      <div ref={footerRef} id="footer-observer" className="absolute bottom-0" />
    </>
  );
};

export default FilterBar;
