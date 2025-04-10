import { configureStore } from "@reduxjs/toolkit";
import bookingSlice from "./slices/bookingSlice";
import tokenSlice from "./slices/tokenSlice";
import userSlice from "./slices/uesrSlice";
// ...

export const store = configureStore({
  reducer: {
    user: userSlice,
    booking: bookingSlice,
    token: tokenSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
