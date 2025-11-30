import { createSlice } from "@reduxjs/toolkit";
import { ChatApi } from "../app/service/chat";

const initialState = {
  history: [],
  chats: [],
  chat: null,
  status: "",
};

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      state.history.data.push(action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    closeChat: (state, action) => {
      state.chat = null;
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ChatApi.endpoints.getHistory.matchFulfilled,
      (state, action) => {
        state.history = action.payload;
      }
    );
    builder.addMatcher(
      ChatApi.endpoints.getChats.matchFulfilled,
      (state, action) => {
        state.chats = action.payload;
      }
    );
    builder.addMatcher(
      ChatApi.endpoints.getChatById.matchFulfilled,
      (state, action) => {
        state.chat = action.payload;
      }
    );
    builder.addMatcher(
      ChatApi.endpoints.createChat.matchFulfilled,
      (state, action) => {
        state.chat = action.payload;
        state.chats = [...state.chats, action.payload];
      }
    );
  },
});

export const selectHistory = (state) => state.chat.history;
export const selectChats = (state) => state.chat.chats;
export const selectChat = (state) => state.chat.chat;

export default ChatSlice.reducer;
export const { sendMessage, setStatus, closeChat } = ChatSlice.actions;
