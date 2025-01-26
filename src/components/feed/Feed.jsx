import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../app/service/auth";

import {
  useGetAllPostsQuery,
  useGetCommentsMutation,
} from "../../app/service/posts";
import { Post } from "../post/Post";

import "./Feed.scss";

const Feed = () => {
  const { data, isLoading } = useGetAllPostsQuery();
  const user = useSelector(selectUser);

  if (isLoading) {
    return <span>loading...</span>;
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
                url={`https://focus-server.onrender.com/${post?.photo}`}
                profileURL={post?.userPhoto}
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
