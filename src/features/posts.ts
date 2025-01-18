import { createSlice } from "@reduxjs/toolkit";
import { PostsApi } from "../app/service/posts";
import { RootState } from "../app/store/store";

type Posts = {
  photo: string;
  lieksCount: string;
  commentsCount: string;
  userPhoto: string;
  nickname: string;
  name: string;
  status: string;
  [key: string]: any;
};

let posts: Posts[] = [];

const initialState = {
  posts,
};

const PostSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      PostsApi.endpoints.post.matchFulfilled,
      (state, action) => {
        state.posts.unshift(action.payload);
      }
    );
    builder.addMatcher(
      PostsApi.endpoints.getAllPosts.matchFulfilled,
      (state, action) => {
        state.posts = action.payload;
      }
    );
    builder.addMatcher(
      PostsApi.endpoints.getUsersPost.matchFulfilled,
      (state, action) => {
        state.posts = action.payload;
      }
    );
    builder.addMatcher(
      PostsApi.endpoints.getUserLikes.matchFulfilled,
      (state, action) => {
        state.posts = action.payload;
      }
    );
    builder.addMatcher(
      PostsApi.endpoints.getUserSaves.matchFulfilled,
      (state, action) => {
        state.posts = action.payload;
      }
    );
    builder.addMatcher(
      PostsApi.endpoints.removePost.matchFulfilled,
      (state, action) => {
        state.posts.filter((el) => el.id != action.payload.id);
      }
    );
  },
});

export default PostSlice.reducer;

export const selectPosts = (state: RootState) => state.posts.posts;
