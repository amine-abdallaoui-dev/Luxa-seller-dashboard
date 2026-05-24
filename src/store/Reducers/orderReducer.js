import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_orders = createAsyncThunk(
  "order/getOrders",
  async ({ page, perPage, search }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/orders-get", {
        params: { page, perPage, search },
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const orderReducer = createSlice({
  name: "order",
  initialState: { loader: false, orders: [], totalItems: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get_orders.fulfilled, (state, action) => {
      state.orders = action.payload?.orders || [];
      state.totalItems = action.payload?.totalItems || 0;
    });
  },
});

export default orderReducer.reducer;
