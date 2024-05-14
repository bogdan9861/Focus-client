import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import { api } from "../service/api";

import auth from "../../features/auth";
import { listener } from "../../middleware/middleware";

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, auth },
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
