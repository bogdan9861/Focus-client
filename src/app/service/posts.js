import { api } from "./api";

export const PostsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsersPost: builder.query({
      query: (id) => ({
        url: `posts/getUsersPost/${id}`,
        method: "GET",
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
      query: (postData) => ({
        url: "posts/post",
        method: "POST",
        body: postData,
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
        body: id,
      }),
    }),
    unSave: builder.mutation({
      query: (id) => ({
        url: "posts/unsave",
        method: "POST",
        body: id,
      }),
    }),
  }),
});

export const {
  useGetCommentsMutation,
  useCommentMutation,
  useGetAllPostsQuery,
  useGetPostByIDMutation,
  useGetUsersPostQuery,
  useLikeMutation,
  useUnlikeMutation,
  useIsLikedMutation,
  usePostMutation,
  useRemovePostMutation,
  useSaveMutation,
  useUnSaveMutation,
} = PostsApi;
