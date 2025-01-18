import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  locked: false,
  started: false,
  posY: null,
  wayHeight: null,
};

const audioLockSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLocked: (state, action) => {
      state.locked = action.payload;
    },

    setPostion: (state, action) => {
      state.posY = action.payload;
    },

    setWayHeight: (state, action) => {
      state.wayHeight = action.payload;
    },

    setStarted: (state, action) => {
      state.started = action.payload;
    },
  },
});

export default audioLockSlice.reducer;
export const { setLocked, setPostion, setStarted, setWayHeight } =
  audioLockSlice.actions;
