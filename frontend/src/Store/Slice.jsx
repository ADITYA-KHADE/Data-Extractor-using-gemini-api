import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllData = createAsyncThunk("data/fetchAllData", async () => {
  const response = await fetch(`/api/data/getdata`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const { data } = await response.json();

  const invoices = [];
  const products = [];
  const customers = [];

  data.forEach((item) => {
    if (item.invoices && item.invoices.length)  {
      invoices.push({
        _id: item._id,
        invoices: item.invoices,
      });
    }
    if (item.products && item.products.length){
      products.push({
        _id: item._id,
        products: item.products,
      })
    }
    if (item.customers && item.customers.length) {
      customers.push({
        _id: item._id,
        customers: item.customers,
      });
    }
  });

  return { invoices, products, customers };
});

const dataSlice = createSlice({
  name: "data",
  initialState: {
    invoices: [],
    products: [],
    customers: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invoices = action.payload.invoices;
        state.products = action.payload.products;
        state.customers = action.payload.customers;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default dataSlice.reducer;
