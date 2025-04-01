import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoriesType } from "../../types/types";

type BookingSliceType = {
  selectedCategory: CategoriesType | null;
  selectedServiceId: string;
};

const initialState: BookingSliceType = {
  selectedCategory: null,
  selectedServiceId: "",
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
  },
});

export const { setSelectedCategory, setSelectedServiceId } =
  bookingSlice.actions;
export default bookingSlice.reducer;
