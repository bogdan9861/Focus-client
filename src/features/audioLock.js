import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locked: false,
  started: false,
  passedDistance: null,
  gapToLock: 130,
};

const audioLockSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLocked: (state, action) => {
      state.locked = action.payload;
    },

    setStarted: (state, action) => {
      state.started = action.payload;
    },

    setPassedDistance: (state, action) => {
      state.passedDistance = action.payload;
    },
  },
});

export default audioLockSlice.reducer;
export const { setLocked, setStarted, setPassedDistance } =
  audioLockSlice.actions;
