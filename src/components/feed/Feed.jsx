import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../app/service/auth";
import { useCurrentUserQuery } from "../../app/service/user";

import {
  useGetAllPostsQuery,
  useGetCommentsMutation,
} from "../../app/service/posts";
import { Post } from "../post/Post";
import Loader from "../loader/Loader";

import "./Feed.scss";

const Feed = () => {
  const { data, isLoading } = useGetAllPostsQuery();
  const user = useCurrentUserQuery();
  const [reversedData, setReversedData] = useState([]);

  useEffect(() => {
    if (data) {
      const arr = [];

      data.forEach((el) => {
        arr.unshift(el);
      });

      setReversedData(arr);
    }
  }, [data]);

  if (isLoading || reversedData.length === 0) {
    return <Loader />;
  }

  return (
    <div className="feed">
      <div className="container">
        <div className="feed__inner">
          {reversedData.map((post) => {
            return (
              <Post
              maxWidth={"80%"}
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
