import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { MdAddAPhoto } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import ModelPopUp from "./components/ModelPopUp.jsx";
import {addShop, clearMessage, getShopInfo, uploadProfileImage} from "../../store/reducers/ProfileReducer.js";
import toast from "react-hot-toast";
import {FadeLoader} from "react-spinners";




const Profile = () => {
    const path = useSelector(state => state.info);

    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [userData,setUserData] = useState("");
    const [shop,setShop] = useState({
        shopName : "",
        division : "",
        district : "",
        subDistrict :"",
    });
    const {userInfo} = useSelector(state => state.auth);
    const {successMessage,errorMessage,loader,shopImage,shopInfo} = useSelector(state=>state.profile)
    const handelProfileImage = (e)=>{
        const image = e.target.files[0];
        dispatch(uploadProfileImage(image))

    }

    const handelShopForm = (e)=>{
        setShop({
            ...shop,
            [e.target.name]: e.target.value,
        })
    }
    const handelSubmit = (e)=>{
        e.preventDefault();
        dispatch(addShop(shop))
    }
    useEffect(() => {
        if(errorMessage !== ""){
            toast.error(errorMessage);
            dispatch(clearMessage())
        }
        if(successMessage !== ""){
            toast.success(successMessage);
            dispatch(clearMessage())

            setUserData(userInfo)
        }
    }, [errorMessage,successMessage]);

    useEffect(()=>{
       dispatch(getShopInfo())
    },[])

    return (
        <>
            {
                show ? <ModelPopUp show={show} setShow={setShow}/> : ""
            }


        <div className='mt-[100px] lg:mt-0 md:mt-0 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className="w-fill bg-white  overflow-hidden ">
                <div className="w-full flex justify-center">
                    <div className="w-[120px] h-[120px] flex flex-col justify-center items-center bg-[#edf5f5] rounded-full relative">
                        {
                            loader ? <FadeLoader color="#a3b18a" cssOverride={{position:"absolute",left:"55px",top:"55px",color:"red",width:'100%',height:"100%",display:"flex" , justifyContent:"center",alignItems:'center'}} />
                                    : <img className="w-full h-full  rounded-full" src={`${shopImage !== "" ? shopImage : path.imagesPath+"/avatar.png"}`}/>

                        }
                        <label htmlFor="profile" className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-black cursor-pointer opacity-50 rounded absolute bottom-0 right-0">
                            <MdAddAPhoto className="text-white text-lg cursor-pointer"/>
                        </label>
                        <input onChange={handelProfileImage} type='file' className="hidden" id='profile'/>
                    </div>

                </div>
                <div className="relative">
                    <div className="my-4 w-full h-[200px] rounded-md bg-gray-900 text-white overflow-hidden relative">
                        <div className="px-5 py-3 w-full h-full flex flex-col justify-center ">
                            <h2 className="text-sm pb-2">Name : {userInfo.name}</h2>
                            <h2 className="text-sm pb-2">Email : {userInfo.email}</h2>
                            <h2 className="text-sm pb-2">Role : {userInfo.role}</h2>
                            <h2 className="text-sm pb-2">status : {userInfo.status}</h2>
                            <h2 className="text-sm pb-2">Payment Account : <span className={`ml-4 px-3 py-2 text-white ${userInfo.payment === "Inactive" ? "bg-red-500" : "bg-green-400"}  rounded-md`}>{userInfo.payment}</span></h2>
                        </div>

                    </div>
                    <divs onClick={()=>setShow(!show)} className="absolute top-1 right-1 cursor-pointer">
                        <span className=" flex justify-center items-center"><FaRegEdit className="w-[28px] h-full p-2 text-sm bg-green-600 rounded text-white"/></span>
                    </divs>
                </div>
                <div className="w-full  mb-5 overflow-hidden">
                    {
                        shopInfo  ? <div className="my-4 w-full h-[200px] rounded-md bg-gray-900 text-white overflow-hidden relative">
                            <div className="px-5 py-3 w-full h-full flex flex-col justify-center ">
                                <h2 className="text-sm pb-2">Shop Name : {shopInfo.shopName}</h2>
                                <h2 className="text-sm pb-2">Division : {shopInfo.division}</h2>
                                <h2 className="text-sm pb-2">District : {shopInfo.district}</h2>
                                <h2 className="text-sm pb-2">Sub District : {shopInfo.subDistrict}</h2>
                            </div>

                        </div>
                            : <form onSubmit={handelSubmit} className="w-[95%] flex flex-col">
                                <div className="my-3 flex flex-col">
                                    <label className="text-gray-800 text-sm font-medium mb-2">Shop Name :</label>
                                    <input name="shopName" value={shop.shopName} onChange={handelShopForm} placeholder="Shop name ..." className="border border-green-200 outline-none rounded-md focus:bg-[#edf5f5] focus:border-green-600  px-4 py-3" type="text" id="shop-name"/>
                                </div>
                                <div className="my-3 flex flex-col">
                                    <label className="text-gray-800 text-sm font-medium mb-2">Division Name :</label>
                                    <input name="division" value={shop.division} onChange={handelShopForm} placeholder="Division ..." className="border border-green-200 outline-none rounded-md focus:bg-[#edf5f5] focus:border-green-600  px-4 py-3" type="text" id="shop-name"/>
                                </div>
                                <div className="my-3 flex flex-col">
                                    <label className="text-gray-800 text-sm font-medium mb-2">District Name :</label>
                                    <input name="district" value={shop.district} onChange={handelShopForm} placeholder="District ..." className="border border-green-200 outline-none rounded-md focus:bg-[#edf5f5] focus:border-green-600  px-4 py-3" type="text" id="shop-name"/>
                                </div>
                                <div className="my-3 flex flex-col">
                                    <label className="text-gray-800 text-sm font-medium mb-2">Sub District Name :</label>
                                    <input name="subDistrict" value={shop.subDistrict} onChange={handelShopForm}  placeholder="Sub District ..." className="border border-green-200 outline-none rounded-md focus:bg-[#edf5f5] focus:border-green-600  px-4 py-3" type="text" id="shop-name"/>
                                </div>
                                <div className="w-full">
                                    <button className="text-white bg-green-400 px-4 py-3 rounded-md mt-3 ml-1 hover:bg-green-300">
                                        Update profile
                                    </button>
                                </div>
                            </form>

                    }
                </div>
            </div>
            <div className="w-full bg-white">
                <div className="">
                    <h2 className="text-gray-800 font-medium p-4">Change Password </h2>
                </div>
                <div className="w-full">
                    <form className="w-[95%] flex flex-col px-5 ">
                        <div className="my-3 flex flex-col">
                            <label className="text-gray-800 text-sm font-medium mb-2">Email Address :</label>
                            <input placeholder="Shop name ..." className="border border-green-200 outline-none rounded-md focus:bg-[#edf5f5] focus:border-green-600  px-4 py-3" type="text" id="shop-name"/>
                        </div>
                        <div className="my-3 flex flex-col">
                            <label className="text-gray-800 text-sm font-medium mb-2">Old Password :</label>
                            <input placeholder="Division ..." className="border border-green-200 outline-none rounded-md focus:bg-[#edf5f5] focus:border-green-600  px-4 py-3" type="password" id="shop-name"/>
                        </div>
                        <div className="my-3 flex flex-col">
                            <label className="text-gray-800 text-sm font-medium mb-2">New Password :</label>
                            <input placeholder="District ..." className="border border-green-200 outline-none rounded-md focus:bg-[#edf5f5] focus:border-green-600  px-4 py-3" type="password" id="shop-name"/>
                        </div>
                        <div className="w-full">
                            <button className="text-white bg-green-400 px-4 py-3 rounded-md mt-3 ml-1 hover:bg-green-300">
                                Update Password
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
        </>
    );
};

export default Profile;