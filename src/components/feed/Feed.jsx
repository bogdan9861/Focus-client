import { useEffect, useState } from "react";

import { useGetAllPostsQuery } from "../../app/service/posts";
import { useCurrentUserQuery } from "../../app/service/user";

import { Post } from "../post/Post";
import { setPhoto } from "../../utils/setPhoto";

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
                profileURL={setPhoto(post?.userPhoto)}
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
