import { createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "../app/service/auth";
import { RootState } from "../app/store/store";

const initialState = {
  user: {
    id: "",
    about: "",
    name: "",
    phone: "",
    photo: "",
    status: "",
    nickname: "",
  },
  isAuthentificated: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(AuthApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthentificated = true;
      })
      .addMatcher(
        AuthApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
          state.isAuthentificated = true;
        }
      )
      .addMatcher(AuthApi.endpoints.current.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthentificated = true;
      });
  },
});

export default AuthSlice.reducer;

export const { logout } = AuthSlice.actions;
