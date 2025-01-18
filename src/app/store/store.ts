import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import { api } from "../service/api";

import auth from "../../features/auth";
import user from "../../features/user";
import posts from "../../features/posts";
import chat from "../../features/chat";
import audioLock from "../../features/audioLock";

import { listener } from "../../middleware/middleware";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
    posts,
    user,
    chat,
    audioLock,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).prepend(listener.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
