import SellerAuthReducer from "./SellerAuthReducer"
import infoReducer from "./infoReducer"
import productReducer from "./productReducer"
import orderReducer from "./orderReducer"
import categoryReducer from "./categoryReducer"
import paymentReducer from "./paymentReducer"

const rootReducers = {
    sellerAuth : SellerAuthReducer,
    info  : infoReducer,
    product : productReducer,
    order : orderReducer,
    category : categoryReducer,
    payment : paymentReducer,
}


export default rootReducers