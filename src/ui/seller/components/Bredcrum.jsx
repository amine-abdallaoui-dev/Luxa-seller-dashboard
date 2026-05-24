import React from 'react'
import { MdOutlineDriveFileMove } from "react-icons/md";
import { Link } from 'react-router-dom';

function Bredcrum({page1,page2,page3}) {
    return (
        <div className='flex justify-start gap-2 items-center w-full h-[50px] text-[13px] text-gray-500'>
            <span><MdOutlineDriveFileMove/></span>
            <span><Link to="/admin/dashboard">{page1}</Link></span>
            <span><MdOutlineDriveFileMove/></span>
            <span>{page2}</span>
            {
                page3 && (
                    <>
                        <span><MdOutlineDriveFileMove/></span>
                        <span>{page3}</span>
                    </>
                )
            }
        </div>
    )
}

export default Bredcrum
