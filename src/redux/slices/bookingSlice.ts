import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedBookingType } from "../../types/BookingType";
import { CategoriesType, ServiceType } from "../../types/types";

type BookingSliceType = {
  selectedCategory: CategoriesType | null;
  selectedService: ServiceType | null;
  bookingId: string;
  selectedBooking: SelectedBookingType | null;
};

const initialState: BookingSliceType = {
  selectedCategory: null,
  selectedService: null,
  bookingId: "",
  selectedBooking: null,
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
    setSelectedService: (state, action: PayloadAction<ServiceType>) => {
      state.selectedService = action.payload;
    },
    setBookingId: (state, action: PayloadAction<string>) => {
      state.bookingId = action.payload;
    },
    setSelectedBooking: (state, action: PayloadAction<SelectedBookingType>) => {
      state.selectedBooking = action.payload;
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedService,
  setBookingId,
  setSelectedBooking,
} = bookingSlice.actions;
export default bookingSlice.reducer;
