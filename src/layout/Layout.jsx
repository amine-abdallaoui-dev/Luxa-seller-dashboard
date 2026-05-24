import React, { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { getSeller } from '../store/Reducers/SellerAuthReducer'

export default function Layout() {
  const [showSideBar, setShowsideBar] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sellerInfo } = useSelector(state => state.sellerAuth)

  // Fix reload bug: if token exists but sellerInfo is empty, re-fetch from server
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token && (!sellerInfo || sellerInfo === "")) {
      dispatch(getSeller())
    }
  }, [dispatch])

  // Protect route: redirect to login only when we know there's no valid session
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      navigate("/seller/login")
    } else if (sellerInfo && sellerInfo !== "" && sellerInfo.role !== "seller") {
      navigate("/seller/login")
    }
  }, [sellerInfo, navigate])

  return (
    <div className="relative w-full flex bg-[#0f1117] min-h-screen">
      <Header showSideBar={showSideBar} setShowsideBar={setShowsideBar} />
      <Sidebar showSideBar={showSideBar} setShowsideBar={setShowsideBar} />
      <div className="w-full ml-0 lg:ml-[260px] mt-[70px] p-4 lg:p-6">
        <Outlet />
      </div>
      {showSideBar && (
        <div
          onClick={() => setShowsideBar(false)}
          className="w-screen h-screen lg:hidden bg-black/60 backdrop-blur-sm z-10 fixed top-0 left-0"
        />
      )}
    </div>
  );
}
