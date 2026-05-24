import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SellerLogin from './pages/auth/SellerLogin'
import SellerRegister from './pages/auth/SellerRegister'
import { Provider } from 'react-redux'
import store from './store/Store'
import Dashboard from './pages/Dashboard'
import Layout from "./layout/Layout"
import AddProduct from "./pages/AddProduct"
import AllProducts from './pages/AllProducts'
import AllDisounts from './pages/AllDiscounts'
import Orders from './pages/Orders'
import PaymentRequests from './pages/PaymentRequests'

function App() {
  return (
    <BrowserRouter>

      <Provider store={store}>
          <Routes>
          <Route  path="/seller/register" element={<SellerRegister/>}/>
          {/* <Route  path="/seller/login" element={<SellerLogin/>}/> */}
            <Route  path="/" element={<SellerLogin/>}/>
          <Route element={<Layout/>}>
                <Route path='/seller/dashboard' element={<Dashboard/>}/>
                <Route path='/seller/add-product' element={<AddProduct/>}/>
                <Route path='/seller/all-products' element={<AllProducts/>}/>
                <Route path='/seller/discounts' element={<AllDisounts/>}/>
                <Route path='/seller/orders' element={<Orders/>}/>
                <Route path='/seller/payment-requests' element={<PaymentRequests/>}/>
          </Route>
        </Routes>
      </Provider>
      
    
    </BrowserRouter>
  )
}

export default App
