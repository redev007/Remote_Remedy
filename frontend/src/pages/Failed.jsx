import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Failed = () => {

  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  window.onload = () => {
    setTimeout(() => {
      setActive(true);
      setTimeout(() => {
        navigate("/buy-medicines");
      }, 3000);
    }, 1000);
  };

  return (
    <div className="my-[100px] mx-0 mt-[150px] text-center">
      <div className={`text-[#f00] text-[0] transition-all duration-300 ease-out h-[200px] flex justify-center items-end ${active? "text-[200px]" : ""}`}>
        <BiErrorCircle className="icon"/>
      </div>
      <div className="p-[50px] pt-[20px] max-w-[1200px] w-full my-0 mx-auto text-blue-8">
        <h1>Payment Failed!!!</h1>
        <br></br>
        <h3>Please Try Again!</h3>
      </div>
      <div className="flex justify-center items-center text-blue-9" onClick={() => setActive(prev => !prev)}>
        <CircularProgress size={24} />
        <p className="ml-[10px]">redirecting to medicines page...</p>
      </div>
    </div>
  );
};
export default Failed;
