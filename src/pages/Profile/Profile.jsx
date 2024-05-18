import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useCurrentUserQuery,
  useFollowMutation,
  useGetUserByIDQuery,
  useGetUserFollowersQuery,
  useGetUserFollowsQuery,
  useGetUserLikesQuery,
  useGetUserSavesQuery,
  useIsFollowedQuery,
  useUnsubMutation,
} from "../../app/service/user";
import { useGetUsersPostQuery } from "../../app/service/posts";

import noPhoto from "../../assets/images/no-photo.png";
import settings from "../../assets/icons/settings.svg";
import Aside from "../../components/aside/Aside";
import { Post } from "../../components/post/Post";

import "./Profile.scss";
import UpdateModal from "../../components/UpdateForm/UpdateModal";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserByIDQuery(id);
  const currentUser = useCurrentUserQuery();

  const postsData = useGetUsersPostQuery(id);
  const savesData = useGetUserSavesQuery(id);
  const likesData = useGetUserLikesQuery(id);

  const followers = useGetUserFollowersQuery(id);
  const follows = useGetUserFollowsQuery(id);
  const isFollowed = useIsFollowedQuery(id);

  const [follow] = useFollowMutation();
  const [unsub] = useUnsubMutation();

  const [posts, setPosts] = useState([]);
  const [postsMode, setPostsMode] = useState("posts");
  const [oppenModal, setOppenModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (postsMode === "posts") {
      if (!postsData.isLoading) {
        setPosts(postsData.data);
      }
    } else if (postsMode === "saves") {
      if (!savesData.isLoading) {
        setPosts(savesData.data);
      }
    } else if (postsMode === "likes") {
      if (!likesData.isLoading) {
        setPosts(likesData.data);
      }
    }
  }, [
    postsMode,
    id,
    postsData.isLoading,
    savesData.isLoading,
    likesData.isLoading,
  ]);

  if (
    isLoading ||
    currentUser.isLoading ||
    postsData.isLoading ||
    savesData.isLoading ||
    likesData.isLoading ||
    followers.isLoading ||
    follows.isLoading ||
    isFollowed.isLoading
  ) {
    return <p>loading...</p>;
  }

  const onSetPostsMode = (e) => {
    if (!e) return;

    const target = e.target;
    const mods = document.querySelectorAll(".profile__posts-mods__item");

    mods.forEach((el) => {
      el.classList.remove("active");
    });

    if (target.tagName === "BUTTON") {
      target.parentNode.classList.add("active");
    }

    target.classList.add("active");
  };

  const onFollow = async () => {
    try {
      await follow(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const onUnsub = async () => {
    try {
      await unsub(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Aside />
      <div className="profile">
        <div className="profile__wrapper">
          <div className="profile__inner">
            {isLoading ? (
              <p>loading...</p>
            ) : (
              <>
                <img
                  className="profile__img"
                  src={data?.photo || noPhoto}
                  alt=""
                />
                <div className="profile__content">
                  <div className="profile__content-top">
                    <span className="profile__name">
                      {data?.nickname || data?.name}
                    </span>
                    {currentUser?.data?.id === id ? (
                      <div className="profile__content-btns">
                        <button
                          className="profile__content-subscribe"
                          onClick={() => setOppenModal(true)}
                        >
                          Edit profile
                        </button>
                        <a className="profile__content-settings" href="#">
                          <img src={settings} alt="" />
                        </a>
                      </div>
                    ) : isFollowed?.data?.followed ? (
                      <button
                        className="profile__content-btn"
                        onClick={() => onUnsub()}
                      >
                        отписаться
                      </button>
                    ) : (
                      <button
                        className="profile__content-btn"
                        onClick={() => onFollow()}
                      >
                        подписаться
                      </button>
                    )}
                  </div>
                  <div className="profile__statistics">
                    <span className="profile__statistic">
                      <span className="profile__statistic-count">
                        {postsData.data.length}
                      </span>
                      posts
                    </span>
                    <span className="profile__statistic">
                      <span className="profile__statistic-count">
                        {followers.data.length}
                      </span>
                      followers
                    </span>
                    <span className="profile__statistic">
                      <span className="profile__statistic-count">
                        {follows.data.length}
                      </span>
                      followed
                    </span>
                  </div>
                  <div className="profile__info">
                    <span className="profile__info-name">{data?.name}</span>
                    <span className="profile__info-about">{data?.about}</span>
                    <p className="profile__info-status">{data?.status}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="profile__posts">
          <div className="container">
            {posts.isLoading ? (
              <p>loading...</p>
            ) : (
              <>
                <ul className="profile__posts-mods">
                  <li className={`profile__posts-mods__item active`}>
                    <button
                      className="profile__posts-mods__btn"
                      onClick={(e) => {
                        setPostsMode("posts");
                        onSetPostsMode(e);
                      }}
                    >
                      POSTS
                    </button>
                  </li>
                  <li className="profile__posts-mods__item">
                    <button
                      className="profile__posts-mods__btn"
                      onClick={(e) => {
                        setPostsMode("saves");
                        onSetPostsMode(e);
                      }}
                    >
                      SAVES
                    </button>
                  </li>
                  <li className="profile__posts-mods__item">
                    <button
                      className="profile__posts-mods__btn"
                      onClick={(e) => {
                        setPostsMode("likes");
                        onSetPostsMode(e);
                      }}
                    >
                      LIKES
                    </button>
                  </li>
                </ul>
                <ul className="profile__posts-list">
                  {posts?.length ? (
                    posts.map((post) => {
                      return (
                        <Post
                          key={post?.id}
                          id={post?.id}
                          userId={post?.userId}
                          url={post?.photo}
                          profileURL={post?.userPhoto}
                          description={post?.description}
                          name={post?.name}
                          self={id === post?.userId}
                          likes={post?.likesCount}
                          status={post?.status}
                        />
                      );
                    })
                  ) : (
                    <p>здесь пусто</p>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      <UpdateModal
        oppen={oppenModal}
        onCancel={() => setOppenModal(false)}
        setOppenModal={setOppenModal}
        data={data}
      />
    </>
  );
};

export default Profile;
