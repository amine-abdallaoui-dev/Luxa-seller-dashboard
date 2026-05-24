import React, {useEffect, useState} from 'react';
import { IoImagesOutline } from "react-icons/io5";
import { RiImageEditLine } from "react-icons/ri";

import {
    clearMessage,
    getCategory,
    getProductById, updateImages,
    updateProduct
} from "../../store/reducers/productReducer.js";
import {useDispatch, useSelector} from "react-redux";
import toast from "react-hot-toast";
import {PulseLoader} from "react-spinners";
import {useParams} from "react-router-dom";



const EditProduct = () => {

    const id = useParams()
    const {loader,successMessage,errorMessage,categories,product,imageLoader} = useSelector(state=>state.product)

    const [Tproduct,setProduct] = useState({
        title :"",
        brands : "",
        category: "",
        price : "",
        description : '',
        discount : "",
        stock : "",
    });

    const [productId,setProductId] = useState(id);
    const [showimages,setShowImages]   = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        setProduct({
            title :product.title,
            brands : product.brand,
            category: product.category,
            price : product.price,
            description : product.description,
            discount : product.discount,
            stock : product.stock,
        })
        setShowImages(product.images)
    }, [product]);

    const handelFormSubmit = (e)=>{
        e.preventDefault()
        const obj  = {
            title :Tproduct.title,
            brand : Tproduct.brands,
            category: Tproduct.category,
            price : Tproduct.price,
            description : Tproduct.description,
            discount : Tproduct.discount,
            stock : Tproduct.stock,
            proId: id,
        }
        dispatch(updateProduct(obj))
    }
    useEffect(()=>{
        if(errorMessage !== ""){
            toast.error(errorMessage);
            dispatch(clearMessage())
        }
        if(successMessage !== ""){
            toast.success(successMessage)
            dispatch(clearMessage())

        }
    },[errorMessage,successMessage])

    useEffect(() => {
        dispatch(getCategory())
    }, []);
    useEffect(()=>{
        dispatch(getProductById(productId))

    },[productId,setProduct])


    const handelChangeImage = (e,image,index)=>{
        const {productId} = id;
        const info = {
            oldImage : image,
            newImage : e.target.files[0],
            productId : productId
        }

        dispatch(updateImages(info))
    }

    return (
        <div className="w-full h-auto ml-0 lg:ml-4 bg-white mt-[120px] lg:my-5 " >
            <form onSubmit={handelFormSubmit}>
                <div className="w-[95%] flex items-center gap-4 mx-4 pt-2 lg:pt-5">
                    <div className="w-full lg:w-6/12">
                        <label className="mb-2 text-gray-900 font-medium text-sm">Product Title :</label>
                        <input value={Tproduct?.title} onChange={(e)=>setProduct({...Tproduct,title:e.target.value})} name='title' className="w-full my-2 outline-none rounded-md text-sm border border-green-300 bg-[#edf5f5] px-3 py-2 focus:border-none focus:outline-green-400"  type="text" placeholder="Product Name"  />
                    </div>
                    <div className="w-full lg:w-6/12 ml-4">
                        <label className="mb-2 text-gray-900 font-medium text-sm">Brand :</label>
                        <input value={Tproduct?.brands} onChange={(e)=>setProduct({...Tproduct,brands:e.target.value})}name="brand" className="w-full my-2 outline-none rounded-md text-sm border border-green-300 bg-[#edf5f5] px-3 py-2 focus:border-none focus:outline-green-400"  type="text" placeholder="Brand Name"  />
                    </div>
                </div>
                <div className="w-[95%] flex items-center gap-4 mx-4 pt-2 lg:pt-5 relative">
                    <div className="w-full lg:w-6/12 ml-4">
                        <label className="mb-2 text-gray-900 font-medium text-sm">Category :</label>
                        <select value={Tproduct?.category} onChange={(e)=>setProduct({...Tproduct,category:e.target.value})} name="category" className="w-full my-2   outline-none rounded-md text-sm border border-green-300 bg-[#edf5f5] px-3 py-2 focus:border-none focus:outline-green-400">
                            <option>Select ...</option>
                            {


                                categories.map(cat => {
                                    return (
                                        <>
                                            <option value={cat.name}>{cat.name}</option>
                                        </>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="w-full lg:w-6/12 ml-4">
                        <label className="mb-2 text-gray-900 font-medium text-sm">Stock :</label>
                        <input value={Tproduct?.stock} onChange={(e)=>setProduct({...Tproduct,stock:e.target.value})} name="stock" className="w-full my-2 outline-none rounded-md text-sm border border-green-300 bg-[#edf5f5] px-3 py-2 focus:border-none focus:outline-green-400"  type="text" placeholder="Brand Name"  />
                    </div>
                </div>
                <div className="w-[95%] flex items-center gap-4 mx-4 pt-2 lg:pt-5">
                    <div className="w-full lg:w-6/12">
                        <label className="mb-2 text-gray-900 font-medium text-sm">Product Price :</label>
                        <input value={Tproduct?.price} onChange={(e)=>setProduct({...Tproduct,price:e.target.value})} name="price" className="w-full my-2 outline-none rounded-md text-sm border border-green-300 bg-[#edf5f5] px-3 py-2 focus:border-none focus:outline-green-400"  type="text" placeholder="Price"  />
                    </div>
                    <div className="w-full lg:w-6/12 ml-4">
                        <label className="mb-2 text-gray-900 font-medium text-sm">Discount :</label>
                        <input value={Tproduct?.discount} onChange={(e)=>setProduct({...Tproduct,discount:e.target.value})} name="discount" className="w-full my-2 outline-none rounded-md text-sm border border-green-300 bg-[#edf5f5] px-3 py-2 focus:border-none focus:outline-green-400"  type="text" placeholder="dicount %"/>
                    </div>
                </div>

                <div className="w-[95%] flex items-center gap-4 mx-4 pt-2 lg:pt-5 relative">
                    <div className="w-full lg:w-full ml-4">
                        <label className="mb-2 text-gray-900 font-medium text-sm">Description :</label>
                        <textarea value={Tproduct?.description} onChange={(e)=>setProduct({...Tproduct,description:e.target.value})} name="description" className="w-full my-2 outline-none rounded-md text-sm border border-green-300 bg-[#edf5f5] px-3 py-2 focus:border-none focus:outline-green-400" cols="10" rows="10"></textarea>
                    </div>
                </div>

                <div className="w-[95%] ml-7 lg:ml-7 pt-2 lg:pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {
                        showimages?.map((image,index) => {
                            return (
                                <div className="w-full h-[160px] relative my-3">
                                    <label htmlFor={`image-${index}`} className="  w-full h-[160px] max-h-full absolute top-0 left-0 opacity-75  bg-black  flex justify-center items-center">
                                        <RiImageEditLine className="text-white text-3xl opacity-80"/>
                                    </label>
                                    <img className="w-full max-h-full" src={image} alt="image"/>
                                    <input   value="" onChange={(e)=>handelChangeImage(e,image)}   type="file"  className="hidden"   id={`image-${index}`}/>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="flex justify-center items-center w-[230px]">
                    <button
                        type="submit"
                        disabled={loader ? true : false}
                        className="w-full ml-6 mx-2 mt-3 mb-8 bg-opacity-100 bg-green-400 py-3 rounded-lg border-white border hover:bg-green-900 text-white hover:shadow-md hover:shadow-gray-700/50"
                    >
                        {loader ? <PulseLoader color={"white"} /> : "Save changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;