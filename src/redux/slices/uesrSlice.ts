import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
  email: string;
};

const initialState: UserType = {
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRegisterEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { setRegisterEmail } = userSlice.actions;
export default userSlice.reducer;
