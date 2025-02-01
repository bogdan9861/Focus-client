import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  useCurrentUserQuery,
  useFollowMutation,
  useGetUserByIDQuery,
  useGetUserFollowersQuery,
  useGetUserFollowsQuery,
  useIsFollowedMutation,
  useUnsubMutation,
} from "../../app/service/user";
import {
  useGetUserLikesMutation,
  useGetUserSavesMutation,
  useGetUsersPostMutation,
} from "../../app/service/posts";

import { useDispatch } from "react-redux";

import { selectPosts } from "../../features/posts";
import { selectUser } from "../../features/user";
import { setFollowed } from "../../features/user";

import Aside from "../../components/aside/Aside";
import { Post } from "../../components/post/Post";
import UpdateModal from "../../components/UpdateForm/UpdateModal";

import noPhoto from "../../assets/images/no-photo.png";
import settings from "../../assets/icons/settings.svg";

import "./Profile.scss";
import Loader from "../../components/loader/Loader";
import FollowsModal from "../../components/FollowsModal/FollowsModal";
import FollowersModal from "../../components/FollowersModal/FollowersModal";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserByIDQuery(id);
  const current = useCurrentUserQuery();
  const user = useSelector(selectUser);

  const [getPosts] = useGetUsersPostMutation();
  const [getSaves] = useGetUserSavesMutation();
  const [getLikes] = useGetUserLikesMutation();
  const [isFollowed] = useIsFollowedMutation();

  const followers = useGetUserFollowersQuery(id);
  const follows = useGetUserFollowsQuery(id);

  const [follow] = useFollowMutation();
  const [unsub] = useUnsubMutation();

  const posts = useSelector(selectPosts);
  const [postsMode, setPostsMode] = useState("posts");
  const [oppenUpdateModal, setOppenUpdateModal] = useState(false);

  const [followsOpen, setFollowsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [isFolowedLoading, setIsFolowedLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);

  const checkFollow = async () => {
    try {
      setIsFolowedLoading(true);
      const res = await isFollowed(id).unwrap();
      
      if (res) {
        dispatch(setFollowed(res.isFollowed.followed));
        setIsFolowedLoading(false);
      }

    } catch (error) {
      setIsFolowedLoading(false);
    }
  };

  useEffect(() => {
    checkFollow();
  }, [id]);

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
    isFolowedLoading
  ) {
    return <Loader />;
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
      <Aside open={true} />
      <div className="profile">
        <div className="profile__wrapper">
          <div className="profile__inner">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <img
                  className="profile__img"
                  src={
                    (user?.photo &&
                      `${process.env.REACT_APP_SERVER_URL}/${user?.photo}`) ||
                    noPhoto
                  }
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
                          Редактировать
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
                      <span className="profile__statistic-name">
                        Публикации
                      </span>
                    </div>
                    <div
                      className="profile__statistic"
                      onClick={() => setFollowersOpen(true)}
                    >
                      <span className="profile__statistic-count">
                        {user.followersCount || followers.data.length}
                      </span>
                      <span className="profile__statistic-name">
                        подписчики
                      </span>
                    </div>
                    <div
                      className="profile__statistic"
                      onClick={() => setFollowsOpen(true)}
                    >
                      <span className="profile__statistic-count">
                        {follows.data.length}
                      </span>
                      <span className="profile__statistic-name">подписки</span>
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
              <Loader />
            ) : (
              <>
                <ul className="profile__posts-mods">
                  <li className={`profile__posts-mods__item active`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3 2C2.44772 2 2 2.44772 2 3V10C2 10.5523 2.44772 11 3 11H10C10.5523 11 11 10.5523 11 10V3C11 2.44772 10.5523 2 10 2H3ZM4 9V4H9V9H4Z"
                          fill="#000000"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14 2C13.4477 2 13 2.44772 13 3V10C13 10.5523 13.4477 11 14 11H21C21.5523 11 22 10.5523 22 10V3C22 2.44772 21.5523 2 21 2H14ZM15 9V4H20V9H15Z"
                          fill="#000000"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13 14C13 13.4477 13.4477 13 14 13H21C21.5523 13 22 13.4477 22 14V21C22 21.5523 21.5523 22 21 22H14C13.4477 22 13 21.5523 13 21V14ZM15 15V20H20V15H15Z"
                          fill="#000000"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3 13C2.44772 13 2 13.4477 2 14V21C2 21.5523 2.44772 22 3 22H10C10.5523 22 11 21.5523 11 21V14C11 13.4477 10.5523 13 10 13H3ZM4 20V15H9V20H4Z"
                          fill="#000000"
                        ></path>
                      </g>
                    </svg>
                    <button
                      className="profile__posts-mods__btn"
                      onClick={(e) => {
                        setPostsMode("posts");
                        onSetPostsMode(e);
                      }}
                    >
                      Публикации
                    </button>
                  </li>
                  <li className="profile__posts-mods__item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <rect width="24" height="24" fill="white"></rect>
                        <path
                          d="M5 19.6693V4C5 3.44772 5.44772 3 6 3H18C18.5523 3 19 3.44772 19 4V19.6693C19 20.131 18.4277 20.346 18.1237 19.9985L12 13L5.87629 19.9985C5.57227 20.346 5 20.131 5 19.6693Z"
                          stroke="#000000"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                    <button
                      className="profile__posts-mods__btn"
                      onClick={(e) => {
                        setPostsMode("saves");
                        onSetPostsMode(e);
                      }}
                    >
                      Избранные
                    </button>
                  </li>
                  <li className="profile__posts-mods__item">
                    <svg
                      fill="#000000"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 979.494 979.494"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <g>
                            <path d="M964.616,227.519c-15.63-44.595-43.082-84.824-79.389-116.338c-36.341-31.543-80.051-53.048-126.404-62.188 c-17.464-3.444-35.421-5.19-53.371-5.19c-52.371,0-103.306,14.809-147.296,42.827c-26.482,16.867-49.745,38.022-68.908,62.484 c-19.158-24.415-42.405-45.53-68.859-62.364C376.42,58.773,325.52,43.985,273.189,43.985c-0.003,0,0.001,0-0.001,0 c-43.604,0-87.367,10.77-126.546,31.143c-39.15,20.358-73.104,49.978-98.188,85.658C22.752,197.343,7.096,238.278,1.92,282.453 c-4.532,38.687-1.032,80.217,10.405,123.436c22.656,85.615,72.803,163.707,110.882,214.142 c82.795,109.659,196.636,209.196,348.028,304.301l18.085,11.36l18.086-11.36C693.624,807.35,823.602,683.842,904.764,546.749 c46.678-78.844,70.994-149.084,74.343-214.733C980.972,295.429,976.096,260.271,964.616,227.519z M489.322,855.248 c-135.253-87.096-237.398-177.586-311.846-276.192c-34.407-45.571-79.583-115.623-99.414-190.562 c-9.245-34.937-12.14-67.951-8.604-98.128c3.846-32.824,15.494-63.262,34.623-90.47c18.844-26.803,44.41-49.085,73.932-64.436 c29.533-15.357,62.444-23.474,95.176-23.474c39.377,0,77.654,11.113,110.692,32.136c32.204,20.492,58.094,49.399,74.868,83.596 l30.559,62.292l30.505-62.318c16.759-34.238,42.648-63.183,74.872-83.705c33.057-21.054,71.358-32.182,110.767-32.182 c13.544,0,27.074,1.314,40.216,3.905c34.739,6.85,67.585,23.042,94.986,46.826c27.39,23.774,48.064,54.023,59.79,87.476 c8.547,24.385,12.164,50.811,10.75,78.542c-2.772,54.379-24.017,114.42-64.944,183.553 C773.338,635.262,656.457,747.659,489.322,855.248z"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <button
                      className="profile__posts-mods__btn"
                      onClick={(e) => {
                        setPostsMode("likes");
                        onSetPostsMode(e);
                      }}
                    >
                      Нравиться
                    </button>
                  </li>
                </ul>
                <ul className="profile__posts-list">
                  {posts?.length ? (
                    posts.map((post) => {
                      return (
                        <Post
                          maxWidth={"700px"}
                          key={post?.id}
                          id={post?.id}
                          userId={post?.userId}
                          url={`${process.env.REACT_APP_SERVER_URL}/${post?.photo}`}
                          profileURL={`${process.env.REACT_APP_SERVER_URL}/${post?.userPhoto}`}
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
      </div>
      <UpdateModal
        oppen={oppenUpdateModal}
        onCancel={() => setOppenUpdateModal(false)}
        setOppenModal={setOppenUpdateModal}
        data={user}
      />
      <FollowsModal
        title="Ваши подписки"
        id={id}
        open={followsOpen}
        setOpen={setFollowsOpen}
      />
      <FollowersModal
        title="Подписчики"
        id={id}
        open={followersOpen}
        setOpen={setFollowersOpen}
      />
    </>
  );
};

export default Profile;
