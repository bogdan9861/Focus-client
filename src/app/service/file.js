import { api } from "./api";

export const FileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation({
      query: (data) => ({
        url: `/files/upload`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUploadMutation } = FileApi;
