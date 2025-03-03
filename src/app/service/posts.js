import { api } from "./api";

export const PostsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsersPost: builder.mutation({
      query: (id) => ({
        url: `posts/getUsersPost`,
        method: "POST",
        body: { id },
      }),
    }),
    getAllPosts: builder.query({
      query: () => ({
        url: "posts/getAllPosts",
        method: "GET",
      }),
    }),
    getPostByID: builder.mutation({
      query: (id) => ({
        url: "posts/getPostByID",
        method: "POST",
        body: id,
      }),
    }),
    getComments: builder.mutation({
      query: (id) => ({
        url: "posts/getComments",
        method: "POST",
        body: { id },
      }),
    }),
    post: builder.mutation({
      query: (fromData) => ({
        url: "posts/post",
        method: "POST",
        body: fromData,
      }),
    }),
    removePost: builder.mutation({
      query: (id) => ({
        url: `posts/remove/${id}`,
        method: "DELETE",
      }),
    }),
    comment: builder.mutation({
      query: ({ message, id }) => ({
        url: "posts/comment",
        method: "POST",
        body: { message, id },
      }),
    }),
    like: builder.mutation({
      query: (id) => ({
        url: "posts/like",
        method: "PUT",
        body: { id },
      }),
    }),
    unlike: builder.mutation({
      query: (id) => ({
        url: "posts/unlike",
        method: "PUT",
        body: { id },
      }),
    }),
    getUserLikes: builder.mutation({
      query: (id) => ({
        url: `/posts/likes`,
        method: "POST",
        body: { id },
      }),
    }),
    isLiked: builder.mutation({
      query: (id) => ({
        url: `posts/isLiked`,
        method: "POST",
        body: { id },
      }),
    }),
    save: builder.mutation({
      query: (id) => ({
        url: "posts/save",
        method: "POST",
        body: { id },
      }),
    }),
    unSave: builder.mutation({
      query: (id) => ({
        url: "posts/unsave",
        method: "DELETE",
        body: { id },
      }),
    }),
    isSaved: builder.mutation({
      query: (id) => ({
        url: `posts/isSaved`,
        method: "POST",
        body: { id },
      }),
    }),
    getUserSaves: builder.mutation({
      query: (id) => ({
        url: `/posts/saves`,
        method: "POST",
        body: { id },
      }),
    }),
    getVideos: builder.query({
      query: () => ({
        url: `/posts/getVideoPosts`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCommentsMutation,
  useCommentMutation,
  useGetAllPostsQuery,
  useGetPostByIDMutation,
  useLikeMutation,
  useUnlikeMutation,
  useIsLikedMutation,
  usePostMutation,
  useRemovePostMutation,
  useSaveMutation,
  useUnSaveMutation,
  useGetUsersPostMutation,
  useGetUserSavesMutation,
  useIsSavedMutation,
  useGetUserLikesMutation,
  useGetVideosQuery,
} = PostsApi;
