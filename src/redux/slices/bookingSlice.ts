import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoriesType } from "../../types/types";

type BookingSliceType = {
  selectedCategory: CategoriesType | null;
  selectedServiceId: string;
  bookingId: string;
};

const initialState: BookingSliceType = {
  selectedCategory: null,
  selectedServiceId: "",
  bookingId: "",
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedCategory: (
      state,
      action: PayloadAction<CategoriesType | null>
    ) => {
      state.selectedCategory = action.payload;
    },
    setSelectedServiceId: (state, action: PayloadAction<string>) => {
      state.selectedServiceId = action.payload;
    },
    setBookingId: (state, action: PayloadAction<string>) => {
      state.bookingId = action.payload;
    },
  },
});

export const { setSelectedCategory, setSelectedServiceId, setBookingId } =
  bookingSlice.actions;
export default bookingSlice.reducer;
