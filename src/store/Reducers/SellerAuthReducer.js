import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";


export const Register = createAsyncThunk(
    "seller/sellerRegister",
    async(info,{fulfillWithValue,rejectWithValue})=>{
        console.log(info)
        try {
            const {data} = await api.post("/seller/register",info,{withCredentials : true})
            //console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            //console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)


export const Login = createAsyncThunk(
    "seller/sellerLogin",
    async(info,{fulfillWithValue,rejectWithValue})=>{
        console.log(info)
        try {
            const {data} = await api.post("/seller/login",info,{withCredentials : true})
            if (data.token) {
                localStorage.setItem("accessToken", data.token);
            }
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)



export const getSeller = createAsyncThunk(
    "seller/getSeller",
     async(_,{fulfillWithValue,rejectWithValue})=>{
        try {
            const {data} = await api.get("/getSellerInfo",{withCredentials : true})
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)




const SellerAuthReducer = createSlice({
    name : "sellerAuth" , 
    initialState : {
        successMessage : "",
        errorMessage : "",
        loader : false , 
        sellerInfo : ""
    },
    reducers : {
        clearMessage : (state)=>{
            state.successMessage = "";
            state.errorMessage = "";
        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase (Register.pending,(state)=>{
            state.loader = true
        })
        .addCase(Register.rejected,(state,{payload})=>{
            state.loader = false ;
            state.errorMessage = payload.error
        })
        .addCase(Register.fulfilled,(state,{payload})=>{
            state.loader = false;
            state.successMessage = payload.message
        })

        .addCase (Login.pending,(state)=>{
            state.loader = true
        })
        .addCase(Login.rejected,(state,{payload})=>{
            state.loader = false ;
            state.errorMessage = payload.error
        })
        .addCase(Login.fulfilled,(state,{payload})=>{
            state.loader = false;
            state.successMessage = payload.message
        })

        .addCase(getSeller.fulfilled,(state,{payload})=>{
            state.sellerInfo = payload.seller
        })
    }
})



export const {clearMessage} = SellerAuthReducer.actions
export default SellerAuthReducer.reducer
