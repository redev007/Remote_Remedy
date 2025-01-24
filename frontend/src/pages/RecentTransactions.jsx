import React, { useContext, useEffect, useState } from "react";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import Preloader from "../components/common/Preloader";
import httpClient from "../httpClient";

const RecentTransactions = () => {
  // Set this to real time transactions:
  // Item Structure: {desc: <Description>, amount: <Transaction Amount>, add: <bool for recharged or charged>, date: <Date should in form of "16 May, 12:05 PM">}
  // const transactions = [{desc: "Doctor Fee", amount: 299, add: false}, {desc: "Recharge", amount: 2000, add: true}, {desc: "Doctor Fee", amount: 499, add: false}];
  const [transactions, setTransactions] = useState([]);
  const { isLoading, toggleLoading } = useContext(commonContext);

  useScrollDisable(isLoading);

  useEffect(() => {
    toggleLoading(true);
    setTimeout(() => toggleLoading(false), 1500);
    httpClient
      .post("/get_wallet_history", { email: localStorage.getItem("email") })
      .then((res) => {
        setTransactions(res.data.wallet_history);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <div className="w-full flex justify-center">
        <div className="max-w-[400px] w-[93vw] mt-16 mb-60 text-blue-8">
      <section>
        <h3 className="text-[1.2rem] mb-6">Transaction History</h3>
        <div>
          {transactions.map((trans, index) => (
            <div
              key={index}
              className="w-full border-[2px] border-blue-8 py-3 px-4 flex justify-between items-center rounded-[5px] mb-[5px] relative"
            >
              <div className="lex flex-col justify-start items-center">
                <p className="text-[1.05rem] font-semibold mb-[0.2rem] whitespace-nowrap text-ellipsis overflow-hidden max-w-[15px]">
                  {trans.desc}
                </p>
                <p>{trans.date}</p>
                <div className="tooltip">{trans.desc}</div>
              </div>
              <div
                className={`text-[1.2em] font-bold ${
                  trans.add ? "text-[#0f0]" : "text-[#f00]"
                }`}
              >
                {trans.add ? "+" : "-"} ₹ {trans.amount}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </div>
  );
};

export default RecentTransactions;
