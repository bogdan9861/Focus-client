import { createSlice } from "@reduxjs/toolkit";
import { ChatApi } from "../app/service/chat";

const initialState = {
  id: "",
};

const ConferenceSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConferenceId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export default ConferenceSlice.reducer;
export const { setConferenceId } = ConferenceSlice.actions;
