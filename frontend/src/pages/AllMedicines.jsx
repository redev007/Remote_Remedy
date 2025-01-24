import React, { useContext, useEffect } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import useDocTitle from "../hooks/useDocTitle";
import FilterBar from "../components/medicines/FilterBar";
import ProductCard from "../components/medicines/ProductCard";
import filtersContext from "../contexts/filters/filterContext";
import EmptyView from "../components/common/EmptyView";
import SearchBar from "../components/common/SearchBar";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const AllMedicines = () => {
  const { isLoading, toggleLoading } = useContext(commonContext);

  useDocTitle("All Medicines");

  const navigate = useNavigate();
  const userNotExists =
    localStorage.getItem("usertype") === undefined ||
    localStorage.getItem("usertype") === null;

  useEffect(() => {
    if (userNotExists) {
      navigate("/");
    } else {
      toggleLoading(true);
      setTimeout(() => toggleLoading(false), 2000);
    }
    //eslint-disable-next-line
  }, []);

  useScrollDisable(isLoading);

  const { allProducts } = useContext(filtersContext);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      {/* search-bar */}
      <section id="" className="pt-20 sticky top-0 z-[500] overflow-hidden">
        <SearchBar />
      </section>
      {/* all_products section*/}
      <section
        id=""
        className=" overflow-hidden py-20 pt-8 grid grid-cols-12 text-blue-6 max-lg:grid-cols-none"
      >
        <div className="col-span-2">
          <FilterBar  />
        </div>
        {/* container */}
        <div className="col-span-10 max-w-[1440px] mx-auto px-3 max-xl:max-w-[1280px] max-lg:max-w-[1024px] max-md:max-w-[768px] max-sm:max-w-[640px] max-xs:max-w-full lg:min-w-[80vw]">
          {allProducts.length > 0 ? (
            // wrapper products_wrapper
            <div className="flex flex-wrap w-full gap-2 ">
              {allProducts.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <EmptyView icon={<BsExclamationCircle />} msg="No Results Found" />
          )}
        </div>
      </section>
    </>
  );
};

export default AllMedicines;
