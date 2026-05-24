import React from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";

const Pagination = ({pageNumber, setPageNumber, perPage, totalItems,showItem}) => {

    let totalPages = Math.ceil(totalItems / perPage);
    let  startPage = pageNumber;
    let defirence = totalPages - pageNumber

    if(defirence <= showItem){
        startPage = totalPages - showItem;
    }
    let endPage = startPage < 0 ? showItem : startPage + showItem
    if(startPage <= 0){
        startPage = 1;
    }

    const createButton = ()=>{

        const button = []
        for(let i = startPage ; i <= endPage ; i++){
            button.push(
                <span onClick={()=>setPageNumber(i)} className={`${pageNumber === i ? "bg-green-400" : "bg-gray-400"} ? py-1 px-3 rounded-md  text-white font-medium hover:bg-green-400`}>{i}</span>
            )
        }
        return button
    }

    return (
        <div className="w-[95%] flex justify-end mr-10 gap-1 items-center mb-3 text-[13px] lg:text-sm">
            {
                pageNumber > 1 && <span onClick={()=>setPageNumber(pageNumber - 1)} className="py-2 px-3 text-sm  rounded-md bg-[#069f96] text-white  font-medium hover:bg-green-400">
                                        <FaArrowLeftLong/>
                                  </span>
            }

            {
                createButton()
            }
            {
                pageNumber < totalPages && <span onClick={()=>setPageNumber(pageNumber + 1 )} className="py-2 px-3 rounded-md bg-[#069f96] text-white font-medium hover:bg-green-400">
                <FaArrowRightLong/>
            </span>
            }
        </div>
    )
};

export default Pagination;