import React, { useContext, useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import commonContext from "../contexts/common/commonContext";
import Preloader from "../components/common/Preloader";
import useScrollDisable from "../hooks/useScrollDisable";
import { CircularProgress } from "@mui/material";
import httpClient from "../httpClient";

const MyWallet = () => {
  const [canSeeMoney, setSeeMoney] = useState(false);

  // Set this to user's balance amount
  const [availableMoney, setAvailableMoney] = useState(0.0);
  const [searchparams] = useSearchParams();
  const [inputMoney, setInputMoney] = useState(
    searchparams.get("recharge") ? searchparams.get("recharge") : ""
  );
  const recommendedMoney = [1000, 1500, 2000];
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // Set this to real time transactions:
  // Item Structure: {desc: <Description>, amount: <Transaction Amount>, add: <bool for recharged or charged>, date: <Date should in form of "16 May, 12:05 PM">}
  // const transactions = [{desc: "Doctor Fee", amount: 299, add: false}, {desc: "Recharge", amount: 2000, add: true}, {desc: "Doctor Fee", amount: 499, add: false}];

  const { isLoading, toggleLoading } = useContext(commonContext);
  const [addingMoney, setAddingMoney] = useState(false);
  const [rechargeText, setRechargeText] = useState("Proceed to Topup");

  useScrollDisable(isLoading);

  useEffect(() => {
    httpClient
      .post("/get_wallet", { email: localStorage.getItem("email") })
      .then((res) => {
        setAvailableMoney(Number(res.data.wallet.toFixed(2)));
      })
      .catch((err) => {
        console.log(err);
      });
    httpClient
      .post("/get_wallet_history", { email: localStorage.getItem("email") })
      .then((res) => {
        setTransactions(res.data.wallet_history);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [localStorage.getItem("wallet")]);

  useEffect(() => {
    setInputMoney((prev) => displayMoney(prev));
    toggleLoading(true);
    setTimeout(() => toggleLoading(false), 1000);
  }, []);

  const displayMoney = (money) => {
    let k = 0;
    while (k < money.length && money[k] === "0") k++;
    let res = "";
    let i = 0;
    for (let j = money.length - 1; j >= k; j--) {
      if (money[j] === ",") continue;
      if ("1234567890".indexOf(money[j]) === -1) return "";
      if (i === 3) {
        res += ",";
        i = 0;
      }
      res += `${Number(money[j]) % 10}`;
      i += 1;
    }
    return res.split("").reverse().join("");
  };

  const handleClick = () => {
    let k = 0;
    while (k < inputMoney.length && inputMoney[k] === "0") k++;
    let res = 0;
    for (let j = k; j < inputMoney.length; j++) {
      if (inputMoney[j] === ",") continue;
      res = res * 10 + Number(inputMoney[j]);
    }
    setAddingMoney(true);
    setTimeout(() => {
      setAddingMoney(false);

      // This is temporarily adding money: Update this to add the money via checkout form
      //start
      localStorage.setItem("wallet", true);
      localStorage.setItem("totalPrice", res);
      navigate("/checkout");
      setTimeout(() => {
        setRechargeText("Successfully Recharged");
      }, 2000);
      //end
    }, 2000);
  };

  if (isLoading) return <Preloader />;

  return (
    // my-wallet
    <div className="w-full flex justify-center">
      <div className="max-w-[400px] w-[93vw] my-auto text-blue-8">
        <h2 className="mb-8">My Wallet</h2>
        {/* check-balance */}
        <section className="flex justify-between item-center text-[1.2rem]">
          <div className="max-w-[50%]">Available balance</div>
          {canSeeMoney ? (
            <div className="flex justify-center items-center font-bold text-[1.3rem]">
              <div>₹ {availableMoney}</div>
              <div
                className="text-[1.2em] ml-2"
                onClick={() => setSeeMoney(false)}
              >
                <MdVisibilityOff />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center font-bold text-[1.3rem]">
              <div>₹ *****</div>
              <div
                className="text-[1.2em] ml-2 "
                onClick={() => setSeeMoney(true)}
              >
                <MdVisibility />
              </div>
            </div>
          )}
        </section>

        <div className="my-8 mx-0 w-full h-[2px] bg-blue-6"></div>

          {/* topup-wallet */}
        <section>
          <h3 className="text-[1.2rem] mb-6">Topup Wallet</h3>
          <div className="w-full">
            <div className="w-full mb-4 font-bold text-blue-8 relative">
              <input
                type="text"
                value={inputMoney}
                onChange={(e) => setInputMoney(displayMoney(e.target.value))}
                placeholder="Enter the amount"
                className="block bg-transparent border-[2px] border-blue-8 w-full text-[1.3rem] font-bold rounded-[3px] transition-all duration-200 ease-in-out py-4 px-[0.85rem] pl-12 focus:border-blue-5"
              />
              <span className="absolute text-[1.5rem] left-[15px] top-[15px] z-[1]">₹</span>
            </div>
            {/* recommended-div */}
            <div className="">
              <div className="text-4 mb-4">Recommended</div>
              <div className="flex justify-start items-start flex-wrap">
                {recommendedMoney.map((money, index) => (
                  <div
                    key={index}
                    className="py-2 px-3 border-[2px] border-blue-5 mr-4 rounded-[6px] cursor-pointer bg-blue-1 transition-all duration-300 ease hover:bg-blue-2"
                    onClick={() =>
                      setInputMoney(displayMoney(money.toString()))
                    }
                  >
                    ₹ {displayMoney(money.toString())}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleClick()}
              disabled={inputMoney === "" || addingMoney}
             className="bg-blue-8 text-white-1 w-full py-4 px-8 mt-8 cursor-pointer transition-all duration-300 ease active:bg-blue-6 disabled:bg-blue-6 hover:bg-blue-6 disabled:cursor-not-allowed rounded-[8px]">
              {addingMoney ? (
                <CircularProgress size={24} sx={{ color: "#f5f5f5" }} />
              ) : (
                rechargeText
              )}
            </button>
          </div>
        </section>

        <div className="my-8 mx-0 w-full h-[2px] bg-blue-6"></div>

        <section>
          <h3 className="text-[1.2rem] mb-6">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <div>
              {transactions.map((trans, index) => (
                <div key={index} className="w-full border-[2px] border-blue-8 py-3 px-4 flex justify-between items-center rounded-[5px] mb-[5px] relative">
                  <div className="flex flex-col justify-start items-center">
                    <p className="text-[1.05rem] font-semibold mb-[0.2rem] whitespace-nowrap text-ellipsis overflow-hidden max-w-[15px]">{trans.desc}</p>
                    <p className="text-[0.9em] whitespace-nowrap text-ellipsis overflow-hidden max-w-[15px]">{trans.date}</p>
                    <div className="absolute opacity-0 invisible hover:opacity-100 hover:visible active:opacity-100 active:visible top-[35px] w-full bg-blue-7">{trans.desc}</div>
                  </div>
                  <div className={`text-[1.2em] font-bold  ${trans.add ? "text-[#0f0]" : "text-[#f00]"}`}>
                    {trans.add ? "+" : "-"} ₹ {trans.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center">No transactions found...</div>
          )}
          {transactions.length > 0 && (
            <button
              className="mt-0"
              onClick={() => navigate("/recent-transactions")}
            >
              View All
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyWallet;
