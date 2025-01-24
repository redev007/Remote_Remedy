import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdCheckmark } from "react-icons/io";
import useDocTitle from "../hooks/useDocTitle";
import useActive from "../hooks/useActive";
import cartContext from "../contexts/cart/cartContext";
import medicinesData from "../data/medicinesData";
import MedicineSummary from "../components/medicines/MedicineSummary";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import httpClient from "../httpClient";

const MedicineDetails = () => {
  useDocTitle("Medicine Details");

  const navigate = useNavigate();

  const { handleActive, activeClass } = useActive(0);

  const { addItem } = useContext(cartContext);

  const { isLoading, toggleLoading, placeOrder } = useContext(commonContext);

  const { productId } = useParams();

  // here the 'id' received has 'string-type', so converting it to a 'Number'
  const prodId = parseInt(productId);

  // showing the Product based on the received 'id'
  const product = medicinesData.find((item) => item.id === prodId);

  const { images, title, price } = product;

  const [previewImg, setPreviewImg] = useState(images[0]);

  let allImages = [...images];

  const [addBalance, setAddBalance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(price);

  useEffect(() => {
    httpClient
      .post("/get_wallet", { email: localStorage.getItem("email") })
      .then((res) => {
        setBalance(Number(res.data.wallet));
      });
  }, []);

  if (images.length < 4) {
    for (let i = 0; i < 4 - images.length; i++) {
      allImages.push(images[0]);
    }
  }

  const [btnActive, setBtnActive] = useState(false);

  // handling Add-to-cart
  const handleAddItem = () => {
    setBtnActive(true);
    addItem(product);

    setTimeout(() => setBtnActive(false), 3000);
  };

  // setting the very-first image on re-render
  useEffect(() => {
    setPreviewImg(images[0]);
    handleActive(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // handling Preview image
  const handlePreviewImg = (i) => {
    setPreviewImg(allImages[i]);
    handleActive(i);
  };

  useEffect(() => {
    toggleLoading(true);
    setTimeout(() => toggleLoading(false), 1500);
    //eslint-disable-next-line
  }, []);

  useScrollDisable(isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      {/* product_details section */}
      <section className="pt-16 pb-20">
        {/* navigation_btns */}
        <div className="flex justify-between items-center flex-wrap mb-8">
          {/* navigation_btn */}
          <div
            className="bg-grey-3 text-white-1 px-8 py-4 m-4 rounded-tr-[8px] rounded-tl-[40px] rounded-bl-[40px] rounded-br-[8px] transition-all duration-300 ease-in-out shadow-[0_0_10px_1px_#b3b8d0] hover:bg-blue-7 active:bg-blue-7"
            onClick={() => navigate("/buy-medicines")}
          >
            Back to store
          </div>
          <div
            className="bg-grey-3 text-white-1 px-8 py-4 m-4 rounded-tr-[40px] rounded-tl-[8px] rounded-bl-[8px] rounded-br-[40px]  transition-all duration-300 ease-in-out shadow-[0_0_10px_1px_#b3b8d0] hover:bg-blue-7 active:bg-blue-7 max-sm:absolute max-sm:right-0 max-sm:top-32 overflow-x-hidden"
            onClick={() => navigate("/all-medicines")}
          >
            Browse all products
          </div>
        </div>

        <div className="max-w-[1440px] px-3 max-xl:max-w-[1280px] max-lg:max-w-[1024px] max-md:max-w-[768px] max-sm:max-w-[640px] max-xs:max-w-full max-sm:mt-20">
          {/* prod_details_wrapper */}
          <div className="grid grid-cols-12 max-lg:grid-cols-none">
            {/*=== Product Details Left-content ===*/}
            {/* prod_details_left_col */}
            <div className="col-span-7 grid grid-cols-8  gap-12 max-sm:grid-cols-none max-sm:flex max-sm:flex-col-reverse px-2">
              {/* prod_details_tabs  */}
              <div className="col-span-2 pt-0 pb-4 flex flex-col justify-between items-end  max-sm:flex-row max-sm:flex-wrap">
                {allImages.map((img, i) => (
                  // tabs_item
                  <div
                    key={i}
                    className={`w-24 h-24 rounded-[3px] py-2 px-2 max-sm:w-[5.5rem] max-sm:h-[5.5rem] max-xs:w-20 max-xs:h-20 ${activeClass(
                      i,
                      "border-[2px] border-blue-2",
                      ""
                    )}`}
                    onClick={() => handleActive(i)} // Update the active index on click
                  >
                    <img
                      src={img}
                      alt="product-img"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* prod_details_img */}
              <figure className="col-span-6 max-lg:mr-6 max-sm:mx-1">
                <img
                  src={previewImg}
                  alt="product-img"
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>

            {/*=== Product Details Right-content ===*/}
            {/* prod_details_right_col */}
            <div className="col-span-5 lg:pl-20 text-blue-8 max-lg:w-[92vw] mt-6">
              {/* prod_details_title */}
              <h1 className="">{title}</h1>
              <h4 className="mt-[0.6rem] mb-[1.2rem] font-semibold text-blue-9">
                Pharmaceuticals
              </h4>

              <div className="mt-[2.2rem] mb-[2.2rem] border-t-[1px] border-t-grey-2"></div>

              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-[2rem]">₹ {price} /- &nbsp;</h2>
                  <span className="text-[0.9rem] text-blue-9">
                    (Inclusive of all taxes)
                  </span>
                </div>

                <div className="bg-green-700 w-auto py-1 px-2 text-xs font-semibold text-white-1 rounded-[3px]">
                  <span>
                    <IoMdCheckmark /> In Stock
                  </span>
                </div>
              </div>

              <div className="mt-[2.2rem] mb-[2.2rem] border-t-[1px] border-t-grey-2"></div>

              <div
                onClick={() => {
                  if (!addBalance) {
                    if (price <= balance) {
                      setTotalBalance(0);
                    } else {
                      setTotalBalance(price - balance);
                    }
                  } else {
                    setTotalBalance(price);
                  }
                  setAddBalance((prev) => !prev);
                }}
                className="use-balance-div flex gap-1"
              >
                <input
                  type="checkbox"
                  checked={addBalance}
                  onChange={() => {}}
                  className="inline-block"
                />
                <p className="inline-block">
                  Use Wallet Money {`(₹ ${balance})`}
                </p>
              </div>

              <div className="use-balance-div">
                <p>
                  Amount to pay: <b>₹ {totalBalance}</b>
                </p>
              </div>
              {/* prod_details_buy_btn */}
              <div className="flex justify-start items-center flex-wrap">
                <button
                  type="button"
                  className="inline-block px-6 py-[0.8rem] rounded-[3px] transition-colors duration-200 ease-out w-[200px] bg-orange-1 text-white-1 mt-2 mr-2 hover:bg-orange-2 active:bg-blue-7"
                  onClick={() => {
                    if (totalBalance === 0) {
                      httpClient.post("/debit_wallet", {
                        email: localStorage.getItem("email"),
                        walletAmount: price,
                      });
                      localStorage.setItem("orders", JSON.stringify([product]));
                      window.location.href =
                        "https://gfg-sfi.onrender.com/success";
                    } else {
                      httpClient.post("/debit_wallet", {
                        email: localStorage.getItem("email"),
                        walletAmount: balance,
                      });
                      setTimeout(() => {
                        localStorage.setItem("totalPrice", totalBalance);
                        placeOrder(product);
                        navigate("/checkout");
                      }, 2000);
                    }
                  }}
                >
                  Buy now
                </button>
                <button
                  type="button"
                  className={`inline-block px-6 py-[0.8rem] rounded-[3px] transition-colors duration-200 ease-out w-[200px] bg-yellow-4 text-white-1 mt-2 mr-2 hover:bg-yellow-6 active:bg-blue-7 ${
                    btnActive && "active"
                  }`}
                  onClick={handleAddItem}
                >
                  {btnActive ? "Added" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MedicineSummary {...product} />
    </>
  );
};

export default MedicineDetails;
