import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectUser } from "../../app/service/auth";
import { useSelector } from "react-redux";

import noPhoto from "../../assets/images/no-photo.png";
import settings from "../../assets/icons/settings.svg";
import Aside from "../../components/aside/Aside";
import { Post } from "../../components/post/Post";

import "./Profile.scss";
import { useGetUserByIDQuery } from "../../app/service/user";
import { useGetUsersPostByIDMutation } from "../../app/service/posts";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserByIDQuery(id);
  const [sendID] = useGetUsersPostByIDMutation();
  const [posts, setPosts] = useState([]);

  const user = useSelector(selectUser);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getPosts();
  }, [id]);

  const getPosts = async () => {
    try {
      const data = await sendID(id).unwrap();
      setPosts(data);
      console.log(data);
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
                    {user.id === id ? (
                      <div className="profile__content-btns">
                        <button className="profile__content-subscribe">
                          Edit profile
                        </button>
                        <a className="profile__content-settings" href="#">
                          <img src={settings} alt="" />
                        </a>
                      </div>
                    ) : (
                      <button>подписаться</button>
                    )}
                  </div>
                  <div className="profile__statistics">
                    <span className="profile__statistic">
                      <span className="profile__statistic-count">2</span>
                      posts
                    </span>
                    <span className="profile__statistic">
                      <span className="profile__statistic-count">10</span>
                      followers
                    </span>
                    <span className="profile__statistic">
                      <span className="profile__statistic-count">103</span>
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
                    <button className="profile__posts-mods__btn">POSTS</button>
                  </li>
                  <li className="profile__posts-mods__item">
                    <button className="profile__posts-mods__btn">SAVES</button>
                  </li>
                  <li className="profile__posts-mods__item">
                    <button className="profile__posts-mods__btn">LIKES</button>
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
                          likes={post?.likesCount}
                          name={post?.name}
                          self={id === post?.userId}
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
    </>
  );
};

export default Profile;
