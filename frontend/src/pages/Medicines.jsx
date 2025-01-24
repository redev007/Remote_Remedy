import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedSlider from "../components/medicines/FeaturedProducts";
import TopProducts from "../components/medicines/TopProducts";
import useDocTitle from "../hooks/useDocTitle";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";

const BuyMedicines = () => {

    const { isLoading, toggleLoading } = useContext(commonContext);

    useDocTitle("Buy Medicines");
    
    const navigate = useNavigate(); 
    const userNotExists = localStorage.getItem("usertype")===undefined || localStorage.getItem("usertype")===null;

    useEffect(() => {
        if(userNotExists) {
            navigate("/");
        } else {
            toggleLoading(true);
            setTimeout(() => toggleLoading(false), 1000);
        }
        //eslint-disable-next-line
    }, []);

    useScrollDisable(isLoading);

    if(isLoading) {
        return <Preloader />;
    }

    return (
        // buy-medicines
        <div id="buy-medicines" className="mb-[100px] text-blue-8">
            {/* home */}
            <section className="px-0 pb-8">
                {/* home__container */}
                <div className="flex justify-evenly items-center max-xs:flex-col-reverse max-xs:items-center max-xs:justify-between">

                    {/* home__data */}
                    <div className="">
                        {/* home__title */}
                        <h1 className="text-[2rem] font-bold mb-4 text-blue-8">MEDICINES <br/> COLLECTION</h1>
                        {/* home__description */}
                        <p className="mb-6 text-blue-5">
                            All medicines at one place...
                        </p>
                        {/* home__price */}
                        <span className="inline-block text-[1.25rem] font-medium text-blue-9 mb-12">Starting at <b>₹49</b> only</span>
                        {/* home__btns */}
                        <div className="flex items-center">
                            {/* home__button */}
                            <button className="bg-blue-8 text-white-1 px-9 py-4 rounded-[8px] cursor-pointer transition-all duration-300 ease-in-out shadow-[0_0_10px_1px_#B0BBD8] hover:bg-blue-9 active:bg-blue-9" onClick={() => navigate("/all-medicines")}>
                                Discover
                            </button>
                        </div>
                    </div>

                    {/* home__imgdiv */}
                    <div className="inline-block w-[260px] pb-[50px] mb-6">
                        {/* home__imgdiv__bg */}
                        <div className="bg-blue-2 px-0 pb-9 w-full h-[430px] flex items-end justify-center relative">
                            {/* home__img */}
                            <img src="buy-medicines-banner.png" alt="" className="w-[240px]"/>
                            {/* home__imgdiv__bg__design triangle-1 */}
                            <div className="absolute  -bottom-[40px] left-0 border-l-[26px] border-transparent border-r-[26px] border-r-transparent border-t-[40px] border-t-blue-2"></div>
                            {/* home__imgdiv__bg__design triangle-2 */}
                            <div className="absolute -bottom-[40px] left-[52px] border-l-[26px] border-transparent border-r-[26px] border-r-transparent border-t-[40px] border-t-blue-2"></div>
                            {/* home__imgdiv__bg__design triangle-3 */}
                            <div className="absolute  -bottom-[40px] left-[104px] border-l-[26px] border-transparent border-r-[26px] border-r-transparent border-t-[40px] border-t-blue-2"></div>
                            {/* home__imgdiv__bg__design triangle-3 */}
                            <div className="absolute  -bottom-[40px] left-[156px] border-l-[26px] border-transparent border-r-[26px] border-r-transparent border-t-[40px] border-t-blue-2"></div>
                            {/* home__imgdiv__bg__design triangle-4 */}
                            <div className="absolute  -bottom-[40px] left-[208px] border-l-[26px] border-transparent border-r-[26px] border-r-transparent border-t-[40px] border-t-blue-2"></div>
                        </div>
                    </div>
    
                    
                </div>
            </section>
            <div className="w-full flex justify-center flex-wrap">
                {/* featured_section */}
            <section className="max-w-[1200px] min-w-[95vw]mx-20 my-auto">
                {/* section-header */}
                <h2 className="text-center text-blue-8">Featured Medicines</h2>
                <FeaturedSlider />
            </section>
            {/* latest_section */}
            <section className="max-w-[1200px] min-w-[95vw]mx-20 my-auto">
                {/* section-header */}
                <h2 className="text-center text-blue-8">Latest Medicines</h2>
                <TopProducts />
            </section>
            </div>
        </div>
    )
}

export default BuyMedicines;