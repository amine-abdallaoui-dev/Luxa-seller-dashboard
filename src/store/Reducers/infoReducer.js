import { createSlice } from "@reduxjs/toolkit";

const infoReducer = createSlice({
    name : "info",
    initialState : {
        imagesPath : "http://localhost:5176/images"
    },
    reducers : {

    },
    extraReducers : ()=>{

    }
})


export default infoReducer.reducer