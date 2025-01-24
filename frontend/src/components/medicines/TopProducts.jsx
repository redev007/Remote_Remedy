import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import ProductCard from './ProductCard';
import medicinesData from '../../data/medicinesData';


const TopProducts = () => {

    return (
        // latest-products
        <div id="" className='p-[10px] mt-12 w-full'>
            {/* wrapper products_wrapper */}
            <div className="flex flex-wrap gap-3">
                {
                    medicinesData.slice(0, 7).map(item => (
                        <ProductCard
                            key={item.id}
                            {...item}
                        />
                    ))
                }
                {/* products_card browse_card */}
                <div className="card w-[24%] max-xs:w-[98%] max-md:w-[46%] max-lg:w-[31%] border-[1px] border-white-1/40 max-h-[520px] shadow-[0_0_5px_2px_#ccc] rounded-[8px] text-blue-6 text-center transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_2px_#7584AE] hover:text-blue-8 text-[1.5rem] flex items-center justify-start px-10 overflow-auto scrollbar-none mb-3">
                    <Link to="/all-medicines">
                        Browse All <br /> Medicines <BsArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopProducts;