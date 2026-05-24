import React from 'react';
import {useSelector} from "react-redux";

const LatestChatBox = () => {
    const path = useSelector(state=>state.info)

    return (
        <div className="w-[95%] h-[90px] mx-5 px-5 mt-2 flex items-center justify-center rounded-2xl bg-gray-900">
            <div className="w-[10%]">
                <img className="w-full" src={`${path.imagesPath}/admin.png`} alt=""/>
            </div>
            <div className="w-full py-2 h-[55px] bg-gray-800 rounded-lg flex items-center justify-start pl-4">
                <p className="text-white font-sm text-sm">last msg from a devloper</p>
            </div>
        </div>
    );
};

export default LatestChatBox;