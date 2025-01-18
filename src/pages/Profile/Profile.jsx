import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  useCurrentUserQuery,
  useFollowMutation,
  useGetUserByIDQuery,
  useGetUserFollowersQuery,
  useGetUserFollowsQuery,
  useIsFollowedQuery,
  useUnsubMutation,
} from "../../app/service/user";
import {
  useGetUserLikesMutation,
  useGetUserSavesMutation,
  useGetUsersPostMutation,
} from "../../app/service/posts";

import { selectPosts } from "../../features/posts";
import { toProxyPath } from "../../utils/toProxyPath";
import { selectUser } from "../../features/user";

import Aside from "../../components/aside/Aside";
import { Post } from "../../components/post/Post";
import UpdateModal from "../../components/UpdateForm/UpdateModal";
import PostModal from "../../components/postModal/PostModal";

import noPhoto from "../../assets/images/no-photo.png";
import settings from "../../assets/icons/settings.svg";
import plus from "../../assets/images/plus.svg";

import "./Profile.scss";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserByIDQuery(id);
  const current = useCurrentUserQuery();
  const user = useSelector(selectUser);

  const [getPosts] = useGetUsersPostMutation();
  const [getSaves] = useGetUserSavesMutation();
  const [getLikes] = useGetUserLikesMutation();

  const followers = useGetUserFollowersQuery(id);
  const follows = useGetUserFollowsQuery(id);
  const isFollowed = useIsFollowedQuery(id);

  const [follow] = useFollowMutation();
  const [unsub] = useUnsubMutation();

  const posts = useSelector(selectPosts);
  const [postsMode, setPostsMode] = useState("posts");
  const [oppenUpdateModal, setOppenUpdateModal] = useState(false);
  const [oppenPostModal, setOppenPostModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (postsMode === "posts") {
      getPosts(id);
    } else if (postsMode === "saves") {
      getSaves(id);
    } else if (postsMode === "likes") {
      getLikes(id);
    }
  }, [postsMode, id]);

  if (
    isLoading ||
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

  const goToChat = async () => {
    navigate(`/chat/${current.data.id}`, { state: { recipientId: id } });
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
                  src={(user?.photo && toProxyPath(user?.photo)) || noPhoto}
                  alt=""
                />
                <div className="profile__content">
                  <div className="profile__content-top">
                    <span className="profile__name">
                      {user?.nickname || user?.name}
                    </span>
                    {current.data.id === id ? (
                      <div className="profile__content-btns">
                        <button
                          className="profile__content-subscribe"
                          onClick={() => setOppenUpdateModal(true)}
                        >
                          Edit profile
                        </button>
                        <a className="profile__content-settings" href="#">
                          <img src={settings} alt="" />
                        </a>
                      </div>
                    ) : user.followed ? (
                      <button
                        className="profile__content-btn grey"
                        onClick={() => onUnsub()}
                      >
                        отписаться
                      </button>
                    ) : (
                      <button
                        className="profile__content-btn blue"
                        onClick={() => onFollow()}
                      >
                        подписаться
                      </button>
                    )}
                    {current.data.id != id ? (
                      <button
                        className="profile__content-btn grey"
                        onClick={goToChat}
                      >
                        Сообщение
                      </button>
                    ) : null}
                  </div>
                  <div className="profile__statistics">
                    <div className="profile__statistic">
                      <span className="profile__statistic-count">
                        {posts.length || 0}
                      </span>
                      <span className="profile__statistic-name">posts</span>
                    </div>
                    <div className="profile__statistic">
                      <span className="profile__statistic-count">
                        {user.followersCount || followers.data.length}
                      </span>
                      <span className="profile__statistic-name">followers</span>
                    </div>
                    <div className="profile__statistic">
                      <span className="profile__statistic-count">
                        {follows.data.length}
                      </span>
                      <span className="profile__statistic-name">follows</span>
                    </div>
                  </div>
                  <div className="profile__info">
                    <span className="profile__info-name">{user?.name}</span>
                    <span className="profile__info-about">{user?.about}</span>
                    <p className="profile__info-status">{user?.status}</p>
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
                          url={toProxyPath(post?.photo)}
                          profileURL={toProxyPath(post?.userPhoto)}
                          name={post?.name}
                          self={current.data.id === post?.userId}
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
        <button
          className="publication-btn"
          onClick={() => setOppenPostModal(true)}
        >
          <img className="publication-btn__icon" src={plus} alt="" />
        </button>
      </div>
      <UpdateModal
        oppen={oppenUpdateModal}
        onCancel={() => setOppenUpdateModal(false)}
        setOppenModal={setOppenUpdateModal}
        data={user}
      />
      <PostModal
        oppen={oppenPostModal}
        onCancel={() => setOppenPostModal(false)}
        setOppenModal={setOppenPostModal}
      />
    </>
  );
};

export default Profile;
