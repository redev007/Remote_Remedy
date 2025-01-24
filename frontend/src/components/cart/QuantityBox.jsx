import React, { useContext } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import cartContext from "../../contexts/cart/cartContext";
import httpClient from "../../httpClient";

const QuantityBox = (props) => {
  const { itemId, itemQuantity } = props;

  const { incrementItem, decrementItem } = useContext(cartContext);

  const increment = (itemId) => {
    httpClient.post("/increase_quantity", {
      email: localStorage.getItem("email"),
      id: itemId,
    });
  };

  const decrement = (itemId) => {
    httpClient.post("/decrease_quantity", {
      email: localStorage.getItem("email"),
      id: itemId,
    });
  };

  return (
    <>
      <div className="inline-block items-center border-[1px] border-blue-3 rounded-[3px] overflow-hidden w-36 h-10 mt-3 relative">
        <button
          type="button"
          onClick={() => {
            decrementItem(itemId), decrement(itemId);
          }}
          disabled={itemQuantity === 1}
          className="w-12 h-full bg-blue-3 text-blue-1 transition-colors duration-200 hover:bg-blue-5 text-white disabled:cursor-not-allowed disabled:text-grey-2"
        >
          <FaMinus />
        </button>
        <span className="h-full w-auto text-center text-red-600 text-2xl font-bold align-top absolute left-[45%]">
          {itemQuantity}
        </span>
        <button
          type="button"
          onClick={() => {
            incrementItem(itemId), increment(itemId);
          }}
          disabled={itemQuantity === 10}
          className="w-12 h-full bg-blue-3 text-blue-1 transition-colors duration-200 hover:bg-blue-5 text-white disabled:cursor-not-allowed disabled:text-grey-2 absolute right-0"
        >
          <FaPlus />
        </button>
      </div>
    </>
  );
};

export default QuantityBox;
