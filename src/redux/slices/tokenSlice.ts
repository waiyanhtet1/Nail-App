import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TokenType = {
  playerId: string;
};

const initialState: TokenType = {
  playerId: "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
  },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
