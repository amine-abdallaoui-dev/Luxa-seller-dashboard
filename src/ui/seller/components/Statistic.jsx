import React from 'react';
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiUserStarFill } from "react-icons/ri";
import { MdBorderColor } from "react-icons/md";

const Statistic = () => {
    return (
        <>
            <div className="w-full shadow-green-400 flex hover:bg-[#edf5f5] border-2 hover:border-white flex-wrap justify-between items-center px-5  bg-white rounded-lg py-[30px]">
                <div className="flex flex-col justify-around ">
                    <h3 className="font-bold text-3xl text-[#0f4749]">$1203</h3>
                    <h4 className="py-2 text-gray-800 font-medium">Totale sales</h4>
                </div>
                <div className="flex items-center justify-center w-[80px] h-[80px] bg-[#0f4749] rounded-full">
                    <MdOutlineCurrencyExchange className="text-3xl text-white" />
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-between hover:bg-[#edf5f5] border-2 hover:border-white items-center px-5  bg-white rounded-lg py-[30px]">
                <div className="flex flex-col justify-around">
                    <h3 className="font-bold text-3xl text-[#0f4749]">30</h3>
                    <h4 className="py-2 text-gray-800 font-medium">Products</h4>
                </div>
                <div className="flex items-center justify-center w-[80px] h-[80px] bg-[#2f3e46] rounded-full">
                    <MdOutlineProductionQuantityLimits className="text-3xl text-white" />
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-between hover:bg-[#edf5f5] border-2 hover:border-white items-center px-5  bg-white rounded-lg py-[30px]">
                <div className="flex flex-col justify-around">
                    <h3 className="font-bold text-3xl text-[#0f4749]">10</h3>
                    <h4 className="py-2 text-gray-800 font-medium">Orders</h4>
                </div>
                <div className="flex items-center justify-center w-[80px] h-[80px] bg-[#a68a64] rounded-full">
                    <RiUserStarFill className="text-3xl text-white" />
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-between hover:bg-[#edf5f5] border-2 hover:border-white items-center px-5  bg-white rounded-lg py-[30px]">
                <div className="flex flex-col justify-around">
                    <h3 className="font-bold text-3xl text-[#0f4749]">20</h3>
                    <h4 className="py-2 text-gray-800 font-medium">Pending Orders</h4>
                </div>
                <div className="flex items-center justify-center w-[80px] h-[80px] bg-[#656d4a] rounded-full">
                    <MdBorderColor className="text-3xl text-white" />
                </div>
            </div>


        </>

    );
};

export default Statistic;