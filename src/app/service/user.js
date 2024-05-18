import { api } from "./api";

export const UserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserLikes: builder.query({
      query: (id) => ({
        url: `/users/likes/${id}`,
        method: "GET",
      }),
    }),
    getUserSaves: builder.query({
      query: (id) => ({
        url: `/users/saves/${id}`,
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
      query: (id) => ({
        url: `/users/followers/${id}`,
        method: "GET",
      }),
    }),
    getUserFollows: builder.query({
      query: (id) => ({
        url: `/users/follows/${id}`,
        method: "GET",
      }),
    }),
    follow: builder.mutation({
      query: (id) => ({
        url: `/users/follow`,
        method: "POST",
        body: { id },
      }),
    }),
    unsub: builder.mutation({
      query: (id) => ({
        url: `/users/unsub`,
        method: "DELETE",
        body: { id },
      }),
    }),
    isFollowed: builder.query({
      query: (id) => ({
        url: `/users/isFollowed/${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/users/update`,
        method: "PUT",
        body: { data },
      }),
    }),
  }),
});

export const {
  useGetUserLikesQuery,
  useGetUserSavesQuery,
  useCurrentUserQuery,
  useFollowMutation,
  useIsFollowedQuery,
  useGetUserByIDQuery,
  useGetUserFollowersQuery,
  useGetUserFollowsQuery,
  useUnsubMutation,
  useUpdateUserMutation,
} = UserApi;
