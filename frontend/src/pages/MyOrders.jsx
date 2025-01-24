import React, { useContext, useState, useEffect } from "react";
import useDocTitle from "../hooks/useDocTitle";
import EmptyView from "../components/cart/EmptyView";
import { useNavigate } from "react-router-dom";
import OrderedItem from "../components/orders/OrderedItem";
import httpClient from "../httpClient";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";


const MyOrders = () => {

    const { isLoading, toggleLoading } = useContext(commonContext);

    const navigate = useNavigate();
    const [orderedItems, setOrderedItems] = useState([]);

    useDocTitle("My Orders");

    useEffect(() => {
        toggleLoading(true);
        httpClient.post('/get_orders', {email: localStorage.getItem("email")})
        .then((res) => {
            setOrderedItems(res.data.orders.reverse());
            toggleLoading(false);
        })
        .catch((err) => {
            toggleLoading(false);
            console.log(err);
        });
    }, []);

    const orderedQuantity = orderedItems.length;
    const [viewAll, setViewAll] = useState(false);

    useScrollDisable(isLoading);

    if(isLoading) {
        return <Preloader />;
    }

    return (
        <>
            <section id="orders" className="py-32 text-blue-8 w-full">
                <div className="w-full flex justify-center">
                    {orderedQuantity === 0 ? (
                        <EmptyView
                            msg="Your Cart is Empty"
                            link="/all-medicines"
                            btnText="Start Shopping"
                        />
                    ) : (
                        // orders_wrapper
                        <div className=" w-[95%] max-w-[600px] my-0 mx-auto">
                            <h2 className="mb-4">Recent Orders</h2>
                            <div className="bg-white-1 rounded-[12px]">
                                {
                                    viewAll? 
                                    orderedItems.map((item) => (
                                        <OrderedItem key={item.id} {...item} />
                                    )) : 
                                    orderedItems.slice(0,3).map((item) => (
                                        <OrderedItem key={item.id} {...item} />
                                    ))
                                }
                            </div>
                            <h3 className="transition-all duration-300 ease-in-out cursor-pointer text-right mt-4 hover:underline" onClick={() => setViewAll((prev) => !prev)}>
                                {viewAll? "show less" : "show more"}</h3>
                        </div>
                    )}
                </div>
                <div className=" text-center mt-12">
                    <button onClick={() => navigate("/")} className="bg-blue-9 text-white-1 py-4 px-[1.5rem] m-4 rounded-[4px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-7 active:bg-blue-7">Back to Home</button>
                </div>
            </section>
        </>
    );
};

export default MyOrders;
