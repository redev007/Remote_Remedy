import React from "react";
import useActive from "../../hooks/useActive";

const MedicineSummary = (props) => {
  const { title } = props;
  const { active, handleActive, activeClass } = useActive("overview");

  return (
    <>
      <section className="py-20 w-full">
        <div className="max-w-[1440px] mx-auto px-3 xs:max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]">
          {/* Product-Summary-Tabs */}
          <div>
            <ul className="flex justify-center gap-10 w-full">
              <li
                className={` rounded-[3px] py-2 px-4 cursor-pointer transition-colors duration-200 ${activeClass(
                  "overview",
                  "bg-blue-8 text-white-1",
                  "bg-transparent text-blue-8"
                )}`}
                onClick={() => handleActive("overview")}
              >
                Overview
              </li>
              <li
                className={`rounded-md py-2 px-4 cursor-pointer transition-colors duration-200 ${activeClass(
                  "desc",
                  "bg-blue-8 text-white-1",
                  "bg-transparent text-blue-8"
                )}`}
                onClick={() => handleActive("desc")}
              >
                Description
              </li>
            </ul>
          </div>

          {/*===== Product-Summary-Details =====*/}
          <div className="mt-16 text-blue-7 flex justify-center">
            {active === "overview" ? (
              <div className="text-center max-w-[550px] w-full">
                <ul>
                  <li className="flex justify-between mb-8">
                    <span>Brand</span>
                    <span className="font-semibold text-blue-8">Cipla</span>
                  </li>
                  <li className="flex justify-between mb-8">
                    <span>Model</span>
                    <span className="font-semibold text-blue-8">{title}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Generic Name</span>
                    <span className="font-semibold text-blue-8">
                      Pharmaceuticals
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="max-w-[550px] w-full my-0 mx-auto">
                <h3 className="font-semibold leading-9">
                  The <span className="text-blue-9">{title}</span> helps in:{" "}
                </h3>
                <ul className="gap-[1.2rem] list-disc ml-4 my-8">
                  <li className="mb-6">reducing acidity</li>
                  <li className="mb-6">reducing acidity</li>
                  <li>reducing acidity</li>
                </ul>
                <p className="leading-4">
                  Buy the <b>{title}</b> today.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MedicineSummary;
