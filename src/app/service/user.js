import { api } from "./api";

export const UserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserLikes: builder.query({
      query: () => ({
        url: "/users/likes",
        method: "GET",
      }),
    }),
    getUserSaves: builder.query({
      query: () => ({
        url: "/users/saves",
        method: "GET",
      }),
    }),
    currentUser: builder.query({
      query: () => ({
        url: "/users/current",
        method: "GET",
      }),
    }),
    getUserByID: builder.query({
      query: (id) => ({
        url: `/users/get/${id}`,
        method: "GET",
      }),
    }),
    getUserFollowers: builder.query({
      query: () => ({
        url: `/users/followers`,
        method: "GET",
      }),
    }),
    getUserFollows: builder.query({
      query: () => ({
        url: `/users/follows`,
        method: "GET",
      }),
    }),
    follow: builder.mutation({
      query: (id) => ({
        url: `/users/follow`,
        method: "POST",
        body: id,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/users/update`,
        method: "PUT",
        body: data,
      }),
    }),
    unsub: builder.mutation({
      query: (id) => ({
        url: `/users/unsub`,
        method: "DELETE",
        body: id,
      }),
    }),
  }),
});

export const {
  useGetUserLikesQuery,
  useGetUserSavesQuery,
  useCurrentUserQuery,
  useFollowMutation,
  useGetUserByIDQuery,
  useGetUserFollowersQuery,
  useGetUserFollowsQuery,
  useUnsubMutation,
  useUpdateUserMutation,
} = UserApi;
