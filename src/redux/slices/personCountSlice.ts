import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PersonType = {
  id: number;
  stylistId: string;
  timeSlot: string;
};

type PersonCountType = Array<PersonType>;

const initialState: PersonCountType = [];

export const personCountSlice = createSlice({
  name: "personCount",
  initialState,
  reducers: {
    // Step 1: Initialize empty slots
    initializePersonArray: (state, action: PayloadAction<number>) => {
      const newArray: PersonCountType = Array.from(
        { length: action.payload },
        (_, index) => ({
          id: index + 1,
          stylistId: "",
          timeSlot: "",
        })
      );
      return newArray;
    },

    // Step 2: Assign stylistId to the first empty slot, only if previous slots are completed
    setStylistDispatch: (state, action: PayloadAction<string>) => {
      const exists = state.some((p) => p.stylistId === action.payload);
      if (exists) return;

      // Find first incomplete slot (stylistId === "" && timeSlot === "")
      const nextSlot = state.find(
        (p) => p.stylistId === "" && p.timeSlot === ""
      );

      // Ensure all previous slots are completed before allowing next
      const nextSlotIndex = state.findIndex((p) => p === nextSlot);
      const previousCompleted = state
        .slice(0, nextSlotIndex)
        .every((p) => p.stylistId !== "" && p.timeSlot !== "");

      if (nextSlot && previousCompleted) {
        nextSlot.stylistId = action.payload;
      }
    },

    // Step 3: Assign timeSlot only to stylist who already has stylistId
    setTimeSlotDispatch: (
      state,
      action: PayloadAction<{ stylistId: string; timeSlot: string }>
    ) => {
      const person = state.find(
        (p) => p.stylistId === action.payload.stylistId && p.timeSlot === ""
      );

      if (person) {
        person.timeSlot = action.payload.timeSlot;
      }
    },

    resetPersonCount: () => initialState,
  },
});

export const {
  initializePersonArray,
  setStylistDispatch,
  setTimeSlotDispatch,
  resetPersonCount,
} = personCountSlice.actions;

export default personCountSlice.reducer;
