import { api } from "./api";

export const ChatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.mutation({
      query: (id) => ({
        url: `/chats/history`,
        method: "POST",
        body: { id },
      }),
    }),

    getChats: builder.mutation({
      query: () => ({
        url: `/chats/get`,
        method: "POST",
      }),
    }),
    getChatById: builder.mutation({
      query: (id) => ({
        url: `/chats/getById`,
        method: "POST",
        body: { id },
      }),
    }),
    sendMessage: builder.mutation({
      query: ({ text, chatId }) => ({
        url: `/chats/send`,
        method: "POST",
        body: { text, chatId },
      }),
    }),
    createChat: builder.mutation({
      query: (userIds) => ({
        url: `/chats/create`,
        method: "POST",
        body: { userIds },
      }),
    }),
    getChatByRecipientId: builder.mutation({
      query: (id) => ({
        url: `/chats/recipient/${id}`,
        method: "POST",
      }),
    }),
    sendVoice: builder.mutation({
      query: (data) => ({
        url: `/chats/upload/voice`,
        method: "POST",
        body: data,
      }),
    }),
    sendFile: builder.mutation({
      query: (data) => ({
        url: `/chats/upload/file`,
        method: "POST",
        body: data,
      }),
    }),
    addUserToChat: builder.mutation({
      query: (data) => ({
        url: `/chats/addUser`,
        method: "POST",
        body: data,
      }),
    }),
    removeUserFromChat: builder.mutation({
      query: (data) => ({
        url: `/chats/removeUser`,
        body: data,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetHistoryMutation,
  useGetChatsQuery,
  useGetChatsMutation,
  useGetChatByIdMutation,
  useSendMessageMutation,
  useCreateChatMutation,
  useGetChatByRecipientIdMutation,
  useSendVoiceMutation,
  useSendFileMutation,
  useAddUserToChatMutation,
  useRemoveUserFromChatMutation,
} = ChatApi;
