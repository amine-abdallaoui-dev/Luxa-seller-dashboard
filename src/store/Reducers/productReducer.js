import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_product = createAsyncThunk(
  "product/addProduct",
  async (
    { title, brands, category, price, description, discount, stock, images, sellerId },
    { fulfillWithValue, rejectWithValue }
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("brands", brands);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("sellerId", sellerId);
    if (images?.length) {
      images.forEach((img) => formData.append("images", img));
    }
    try {
      const { data } = await api.post("/seller/add-product", formData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const get_products = createAsyncThunk(
  "product/getProducts",
  async ({ page, perPage, search }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/products-get", {
        params: { page, perPage, search },
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const delete_product = createAsyncThunk(
  "product/deleteProduct",
  async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/seller/product-delete",
        { id },
        { withCredentials: true }
      );
      return fulfillWithValue({ ...data, id });
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const productReducer = createSlice({
  name: "product",
  initialState: {
    loader: false,
    successMessage: "",
    errorMessage: "",
    products: [],
    totalItems: 0,
  },
  reducers: {
    clearMessage: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_product.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_product.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || "Product added";
      })
      .addCase(add_product.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Failed to add product";
      })
      .addCase(get_products.fulfilled, (state, action) => {
        state.products = action.payload?.products || [];
        state.totalItems = action.payload?.totalItems || 0;
      })
      .addCase(delete_product.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload.id);
      });
  },
});

export const { clearMessage } = productReducer.actions;
export default productReducer.reducer;
