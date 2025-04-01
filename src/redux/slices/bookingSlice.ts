import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoriesType } from "../../types/types";

type BookingSliceType = {
  selectedCategory: CategoriesType | null;
};

const initialState: BookingSliceType = {
  selectedCategory: null,
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<BookingSliceType>) => {
      state.selectedCategory = action.payload.selectedCategory;
    },
  },
});

export const { setSelectedCategory } = bookingSlice.actions;
export default bookingSlice.reducer;
