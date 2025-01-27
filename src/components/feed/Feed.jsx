import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../app/service/auth";

import {
  useGetAllPostsQuery,
  useGetCommentsMutation,
} from "../../app/service/posts";
import { Post } from "../post/Post";
import Loader from "../loader/Loader";

import "./Feed.scss";

const Feed = () => {
  const { data, isLoading } = useGetAllPostsQuery();
  const user = useSelector(selectUser);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="feed">
      <div className="container">
        <div className="feed__inner">
          {data.map((post) => {
            return (
              <Post
                key={post?.id}
                id={post?.id}
                userId={post?.userId}
                url={`${process.env.REACT_APP_SERVER_URL}/${post?.photo}`}
                profileURL={`${process.env.REACT_APP_SERVER_URL}/${post?.userPhoto}`}
                description={post?.description}
                likes={post?.likesCount}
                name={post?.name}
                self={user.id === post?.userId}
                status={post?.status}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Feed;
