import React, { useContext } from 'react';
import { Link } from 'react-router-dom';


const OrderedItem = (props) => {

    const { id, images, title, price, quantity,Ordered_on } = props;
    return (
        <>
            <div className="grid grid-cols-5 gap-6 p-8 rounded-[12px] border-b-[3px] border-b-[rgba(#666666,0.6)] max-sm:gap-20">
                <figure className="col-span-2">
                    <Link to={`/all-medicines/medicine-details/${id}`}>
                        <img src={images[0]} alt="product-img" className='rounded-[12px] max-w-[150px] max-h-[150px] max-sm:max-w-[120px] max-sm:max-h-[120px]'/>
                    </Link>
                </figure>
                <div className="col-span-3">
                    <div className="flex justify-between items-center gap-[1.4rem]">
                        <h4 className="text-4 font-medium leading-[1.3] max-sm:text-[0.8rem]">
                            <Link to={`/all-medicines/medicine-details/${id}`}><span className="text-[1.5rem] font-semibold mt-4">{title}</span> <br />Pharmaceuticals</Link>
                        </h4>
                    </div>

                    <h2 className="text-[1.3rem] text-blue-7 my-4 max-sm:text-[0.95rem]">
                        ₹ {price} /-&nbsp;
                    </h2>

                    <h3 className='text-[1rem] text-blue-7 leading-[1.5] max-sm:text-[0.95rem]'>Quantity: {quantity}</h3>
                    <h3 className='text-[1rem] text-blue-7 leading-[1.5] max-sm:text-[0.95rem]'>Ordered on: {Ordered_on}</h3>
                </div>
            </div>
        </>
    );
};

export default OrderedItem;