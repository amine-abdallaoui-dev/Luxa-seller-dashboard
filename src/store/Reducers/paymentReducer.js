import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const request_payment = createAsyncThunk(
  "payment/requestPayment",
  async ({ amount }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/seller/payment-request",
        { amount },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const get_payment_requests = createAsyncThunk(
  "payment/getPaymentRequests",
  async ({ page = 1, perPage = 10 }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/payment-requests", {
        params: { page, perPage },
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const get_payment_stats = createAsyncThunk(
  "payment/getPaymentStats",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.get("/seller/payment-stats", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const paymentReducer = createSlice({
  name: "payment",
  initialState: {
    loader: false,
    successMessage: "",
    errorMessage: "",
    requests: [],
    totalItems: 0,
    stats: {
      totalRequested: 0,
      totalApproved: 0,
      pendingCount: 0,
      netBalance: 0,
    },
  },
  reducers: {
    clearMessage: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(request_payment.pending, (state) => {
        state.loader = true;
      })
      .addCase(request_payment.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "Request submitted";
        if (payload?.request) {
          state.requests = [payload.request, ...state.requests];
          state.totalItems += 1;
        }
      })
      .addCase(request_payment.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Failed to submit request";
      })
      .addCase(get_payment_requests.fulfilled, (state, { payload }) => {
        state.requests = payload?.requests || [];
        state.totalItems = payload?.totalItems || 0;
      })
      .addCase(get_payment_stats.fulfilled, (state, { payload }) => {
        state.stats = {
          totalRequested: payload?.totalRequested || 0,
          totalApproved: payload?.totalApproved || 0,
          pendingCount: payload?.pendingCount || 0,
          netBalance: payload?.netBalance || 0,
        };
      });
  },
});

export const { clearMessage } = paymentReducer.actions;
export default paymentReducer.reducer;
