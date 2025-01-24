import React from "react";
import { Link } from "react-router-dom";

const EmptyView = (props) => {
  const { msg, link, btnText } = props;

  return (
    <>
      <div className="grid place-items-center gap-[2rem]">
        <div className="w-[90vw] max-w-[400px]">
          <img
            src="empty-cart.png"
            alt="empty-cart"
            className="rounded-[80px]"
          />
        </div>
        <h2>{msg}</h2>
        <div className="text-center">
          <p>Looks like you have not added anything in your cart.</p>
          <p>Go ahead and explore latest medicines.</p>
        </div>
        {link && (
          <Link
            to={link}
            className="inline-block bg-blue-9 px-2 py-3 text-blue-1 rounded-[3px] transition-colors duration-200 ease-out hover:bg-blue-7"
          >
            {btnText}
          </Link>
        )}
      </div>
    </>
  );
};

export default EmptyView;
