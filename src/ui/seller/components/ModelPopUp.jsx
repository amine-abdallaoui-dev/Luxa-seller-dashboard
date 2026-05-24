import React from 'react';

const ModelPopUp = ({show , setShow}) => {
    return (
        <>
            <div  className='min-h-screen bg-black w-screen opacity-70 absolute top-0 left-0 z-[999] flex justify-center items-center'>

            </div>
            <div onClick={()=>setShow(false)} className="h-screen w-screen flex absolute top-0 left-0 justify-center items-center z-[9999]  rounded-md ">
                <div className="w-[460px] h-[490px] bg-white overflow-hidden rounded-md">
                    <h1 className="text-gray-800 p-4">Profile Info</h1>
                    <form className="w-|95%] h-full my-4">
                        <div className="w-[95%]  flex flex-col">
                            <label className="mx-3 mb-3 text-gray-800 text-sm font-medium" htmlFor="profile-name">Name complete :</label>
                            <input className="rounded-md outline-none focus:border-green-300 focus:bg-[#edf5f5] border border-green-300 px-4 py-3 w-full mx-3" type="text" id="profile-name" name="Name ..." />
                        </div>
                        <div className="w-[95%]  flex flex-col mt-5">
                            <label className="mx-3 mb-3 text-gray-800 text-sm font-medium" htmlFor="profile-name">Email Address :</label>
                            <input className="rounded-md outline-none focus:border-green-300 focus:bg-[#edf5f5] border border-green-300 px-4 py-3 w-full mx-3" type="email" id="profile-name" name="Email ..." />
                        </div>
                        <div className="w-[95%]  flex flex-col mt-5">
                            <label className="mx-3 mb-3 text-gray-800 text-sm font-medium" htmlFor="profile-name"> Shop Name :</label>
                            <input className="rounded-md outline-none focus:border-green-300 focus:bg-[#edf5f5] border border-green-300 px-4 py-3 w-full mx-3" type="email" id="profile-name" name="shop name ..." />
                        </div>
                        <button className="mt-4 ml-4  px-4 py-3 text-white font-medium rounded-md bg-green-400 hover:bg-green-300">Update</button>
                    </form>
                </div>
            </div>

        </>
    );
};

export default ModelPopUp;