import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TokenType = {
  playerId: string;
  subsId: string;
};

const initialState: TokenType = {
  playerId: "",
  subsId: "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.playerId = action.payload;
    },
    setSubId: (state, action: PayloadAction<string>) => {
      state.subsId = action.payload;
    },
  },
});

export const { setToken, setSubId } = tokenSlice.actions;
export default tokenSlice.reducer;
