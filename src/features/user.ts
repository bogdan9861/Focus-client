import { createSlice } from "@reduxjs/toolkit";
import { UserApi } from "../app/service/user";
import { RootState } from "../app/store/store";

type State = {
  user: {
    id: string;
    about: string;
    name: string;
    phone: string;
    photo: string;
    status: string;
    nickname: string;
    followed: boolean;
    followersCount: number;
    [key: string]: any;
  };
};

const initialState: State = {
  user: {
    id: "",
    about: "",
    name: "",
    phone: "",
    photo: "",
    status: "",
    nickname: "",
    followed: false,
    followersCount: 0,
  },
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFollowed: (state, action) => {
      state.user.followed = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      UserApi.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      UserApi.endpoints.getUserByID.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      UserApi.endpoints.isFollowed.matchFulfilled,
      (state, action) => {
        state.user.followed = action.payload.followed;
      }
    );
    builder.addMatcher(
      UserApi.endpoints.follow.matchFulfilled,
      (state, action) => {
        state.user.followersCount = action.payload.length;
        state.user.followed = true;
      }
    );
    builder.addMatcher(
      UserApi.endpoints.unsub.matchFulfilled,
      (state, action) => {
        state.user.followersCount = action.payload.length;
        state.user.followed = false;
      }
    );
    builder.addMatcher(
      UserApi.endpoints.currentUser.matchFulfilled,
      (state, action) => {
        state.user.id = action.payload.id;
        state.user.followed = false;
      }
    );
  },
});

export default UserSlice.reducer;

export const selectUser = (state: RootState) => state.user.user;
export const { setFollowed } = UserSlice.actions;
