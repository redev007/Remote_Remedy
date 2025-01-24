import React from "react";

const Home = (props) => {
  return (
    <>
      <div id="" className="max-w-[400px] leading-9 tablet:grid-col padding-x-2">
        <p className="text-blue-6 ">
          Before using this symptom checker, please read carefully and accept
          our Terms and Services:
        </p>
        <ul className="text-blue-6">
          <li className="px-[0.6rem] py-[0.2rem]">
            🔹 This checkup is not a diagnosis.
          </li>
          <li className="px-[0.6rem] py-[0.2rem]">
            🔹 This checkup is for informational purposes and is not a qualified
            medical opinion.
          </li>
          <li className="px-[0.6rem] py-[0.2rem]">
            🔹 Information that you provide is anonymous and not shared with
            anyone.
          </li>
        </ul>
        <form className="usa-form text-[1rem] text-blue-5">
          <div className="flex justify-start items-center">
            <input
              checked={props.isChecked}
              onChange={props.checked}
              className="mr-[10px] peer relative top-[10px]"
              id="truth"
              type="checkbox"
              name="historical-figures-1"
              value="truth"
            />
            <label
              className="text-blue-8 h-4 peer-checked:outline-none"
              htmlFor="truth"
            >
              I agree to the Remote_Remedy terms and conditions
            </label>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
