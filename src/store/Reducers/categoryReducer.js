import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getPublicCategories = createAsyncThunk(
  "category/getPublicCategories",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/public/categories");
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const categoryReducer = createSlice({
  name: "category",
  initialState: { categories: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPublicCategories.fulfilled, (state, action) => {
      state.categories = action.payload?.categories || [];
    });
  },
});

export default categoryReducer.reducer;
