import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AuthApi } from "../app/service/auth";

export const listener = createListenerMiddleware();

listener.startListening({
  matcher: AuthApi.endpoints.login.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    if (action.payload.token) {
      localStorage.setItem("token", action.payload.token);
    }
  },
});
