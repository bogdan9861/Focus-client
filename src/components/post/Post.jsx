import React, { useEffect, useRef, useState } from "react";
import "../feed/Feed.scss";
import {
  useIsLikedMutation,
  useIsSavedMutation,
  useLikeMutation,
  useRemovePostMutation,
  useSaveMutation,
  useUnSaveMutation,
  useUnlikeMutation,
} from "../../app/service/posts";

import noPhoto from "../../assets/images/no-photo.png";
import { Link } from "react-router-dom";
import { Modal, notification } from "antd";

import Comments from "../comments/Comments";
import menu from "../../assets/icons/menu.svg";
import PhotoViewer from "../PhotoViewer/PhotoViewer";
import LikeButton from "../LikeButton/LikeButton";
import MixComments from "../../pages/Mixes/MixComments/MixComments";

export const Post = ({
  id,
  userId,
  name,
  url,
  profileURL,
  self,
  likes,
  status,
  maxWidth,
  height,
  date,
  isMix = false,
  isCurrent,
  currentIndex,
}) => {
  const [doLike] = useLikeMutation();
  const [doUnlike] = useUnlikeMutation();
  const [checkIsLiked] = useIsLikedMutation();
  const [checkIsSaved] = useIsSavedMutation();
  const [doSave] = useSaveMutation();
  const [doUnsave] = useUnSaveMutation();
  const [doDelete] = useRemovePostMutation();

  const [commentsCount, setCommentsCount] = useState(0);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [oppenComment, setOppenComment] = useState(false);
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const [isSavedLocal, setIsSavedLocal] = useState(false);

  const [oppenMenu, setOppenMenu] = useState(false);
  const [oppenRemoveAlert, setOppenRemoveAlert] = useState(false);
  const [PohotoViewOpen, setPhotoViewOpen] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const video = useRef(null);

  const openNotification = ({ duration, description }) => {
    api.open({
      message: "Уведомление",
      placement: "topLeft",
      description,
      duration,
    });
  };

  useEffect(() => {
    setCurrentLikes(+likes);
    isLiked();
    isSaved();
  }, []);

  const isLiked = async () => {
    try {
      const res = await checkIsLiked(id).unwrap();
      setIsLikedLocal(res.isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const isSaved = async () => {
    try {
      const res = await checkIsSaved(id).unwrap();
      setIsSavedLocal(res.isSaved);
    } catch (error) {
      console.log(error);
    }
  };

  const likeToggle = () => {
    isLikedLocal
      ? setCurrentLikes(currentLikes - 1)
      : setCurrentLikes(currentLikes + 1);

    setIsLikedLocal(!isLikedLocal);
  };

  const onLike = () => {
    if (isLikedLocal) {
      unlike();
    } else {
      like();
    }
    likeToggle();
  };

  const like = async () => {
    try {
      await doLike(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const unlike = async () => {
    try {
      await doUnlike(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const onSave = async () => {
    try {
      await doSave(id).unwrap();
      setIsSavedLocal(true);

      openNotification({
        description: "Пост добавлен в сохранённые",
        duration: 3,
      });

      setIsSavedLocal(!isSavedLocal);
      setOppenMenu(false);
    } catch (error) {
      if (error?.data.message) {
        openNotification({ description: error?.data.message, duration: 5 });
      } else {
        openNotification({ description: "Произошла ошибка", duration: 5 });
      }
    }
  };

  const unSave = async () => {
    try {
      await doUnsave(id).unwrap();
      setIsSavedLocal(false);
      setOppenMenu(false);
      openNotification({
        description: "Пост удалён из сохранённых",
        duration: 3,
      });
    } catch (error) {
      if (error?.data.message) {
        openNotification({ description: error?.data.message, duration: 5 });
      } else {
        openNotification({ description: "Произошла ошибка", duration: 5 });
      }
    }
  };

  const onDelete = async () => {
    try {
      await doDelete(id).unwrap();
      openNotification({ description: "Пост успешно удалён", duration: 3 });

      setOppenRemoveAlert(false);
      setOppenMenu(false);
    } catch (error) {
      if (error?.data.message) {
        openNotification({ description: error?.data.message, duration: 5 });
      } else {
        openNotification({ description: "Произошла ошибка", duration: 5 });
      }
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      const className = e.target.className;

      if (className !== "feed__post-menu-btn") {
        document.querySelectorAll(".feed__post-menu-list").forEach((menu) => {
          menu.classList.remove("active");
        });
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (!video.current || !isMix) return;

    const videos = document.querySelectorAll(
      ".feed__post-img.feed__post-img--mix"
    );

    if (isCurrent) {
      videos[currentIndex - 1]?.pause();
      videos[currentIndex + 1]?.pause();
      video.current.play();
      video.current.muted = false;
    }
  }, [video, isCurrent]);

  const onPause = (e) => {
    const video = e.target;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div
      className={`feed__post ${isMix && "feed__post--mix"}`}
      style={{ maxWidth, height }}
      onDoubleClick={onLike}
    >
      {contextHolder}
      {!isMix && (
        <div className="feed__post-top">
          <Link className="feed__post-profile" to={`/profile/${userId}`}>
            <img
              className="feed__post-profile__img"
              src={profileURL || noPhoto}
              alt=""
            />
            <div className="feed__post-profile-info">
              <span className="feed__post-profile-name">{name}</span>
              <span className="feed__post-profile-status">{date}</span>
            </div>
          </Link>
          <div className="feed__post-menu-wrapper">
            <button
              className="feed__post-menu-btn"
              onClick={() => setOppenMenu(!oppenMenu)}
            >
              <img className="feed__post-menu-btn" src={menu} alt="" />
            </button>
            <ul className={`feed__post-menu-list ${oppenMenu ? "active" : ""}`}>
              <li className="feed__post-menu-list__item">
                {!isSavedLocal ? (
                  <button
                    className="feed__post-menu-list__item-btn"
                    onClick={() => onSave()}
                  >
                    сохранить
                  </button>
                ) : (
                  <button
                    className="feed__post-menu-list__item-btn"
                    onClick={() => unSave()}
                  >
                    удалить из сохранённых
                  </button>
                )}
              </li>
              {self ? (
                <li className="feed__post-menu-list__item">
                  <button
                    className="feed__post-menu-list__item-btn red"
                    onClick={() => setOppenRemoveAlert(true)}
                  >
                    удалить
                  </button>
                </li>
              ) : null}
            </ul>
            <Modal
              open={oppenRemoveAlert}
              onOk={() => onDelete()}
              onCancel={() => setOppenRemoveAlert(false)}
            >
              <h1 className="remove-alert__title">
                Вы уверенны,что хоите удалить эту публикацию?
              </h1>
              {url.split(".")[1] === "mp4" ? (
                <video
                  ref={video}
                  src={url}
                  playsInline
                  controls
                  muted
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                <img className="remove-alert__img" src={url} alt="" />
              )}

              <button
                className="remove-alert__btn send__btn"
                onClick={() => setOppenRemoveAlert(false)}
              >
                отмена
              </button>
              <button
                className="remove-alert__btn send__btn red"
                onClick={() => onDelete()}
              >
                удалить
              </button>
            </Modal>
          </div>
        </div>
      )}

      {url.indexOf(".mp4") > 0 ||
      url.indexOf(".MP4") > 0 ||
      url.indexOf(".mov") > 0 ? (
        <div className="feed__post-video__wrapper">
          <video
            onClick={onPause}
            ref={video}
            className={`feed__post-img ${isMix && "feed__post-img--mix"}`}
            src={url}
            controls={!isMix}
            autoPlay={!isMix}
            playsInline
            muted
            loop={isMix}
            style={{ height, maxHeight: height, marginBottom: !isMix && 20 }}
          ></video>
          {isMix && (
            <div className="feed__post-mix__info">
              <span className="feed__post-mix__info-name">{name}</span>
              <span className="feed__post-mix__info-date">{date}</span>
            </div>
          )}
        </div>
      ) : (
        <img
          className="feed__post-img viewer"
          src={url}
          alt=""
          style={{ marginBottom: !isMix && 20 }}
          onClick={() => setPhotoViewOpen(true)}
        />
      )}
      {!isMix ? (
        <>
          <div className="feed__post-statistic">
            <LikeButton onLike={onLike} isLikedLocal={isLikedLocal} />
            <button className="feed__post-statistic-btn">
              <svg
                viewBox="0 -1 24 24"
                id="meteor-icon-kit__regular-comments"
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
                    d="M8 13H6.35758L3.26816 15.5333C2.41403 16.2337 1.15385 16.1091 0.453464 15.2549C0.160246 14.8974 0 14.4492 0 13.9868V5C0 2.23858 2.23858 0 5 0H11C13.7614 0 16 2.23858 16 5V6H19C21.7614 6 24 8.23858 24 11V19.9868C24 20.4492 23.8398 20.8974 23.5465 21.2549C22.8462 22.1091 21.586 22.2337 20.7318 21.5333L17.6424 19H13C10.2386 19 8 16.7614 8 14V13zM8 11C8 8.23858 10.2386 6 13 6H14V5C14 3.34315 12.6569 2 11 2H5C3.34315 2 2 3.34315 2 5V13.9868L5.64242 11H8zM13 8C11.3431 8 10 9.3431 10 11V14C10 15.6569 11.3431 17 13 17H18.3576L22 19.9868V11C22 9.3431 20.6569 8 19 8H13z"
                    fill="#212121"
                  ></path>
                </g>
              </svg>
            </button>
          </div>

          <div className="feed__post-info">
            <span className="likes-count">{currentLikes}</span>
            <span className="feed__post-info__text">отметок "Нравиться"</span>
          </div>
          <div className="feed__post-info">
            <span
              className="feed__post-info__text"
              onClick={() => setOppenComment(!oppenComment)}
            >
              посмотреть все комментарии ({commentsCount})
            </span>
          </div>
          <Comments
            id={id}
            setCommentsCount={setCommentsCount}
            oppenComment={oppenComment}
            setOppenComment={setOppenComment}
          />
        </>
      ) : (
        <div className="feed-post__mix-controls">
          <div className="feed-post__mix-controls__inner">
            <Link className="feed__post-profile" to={`/profile/${userId}`}>
              <img
                className="feed-post__mix-control__img feed__post-profile__img"
                src={profileURL || noPhoto}
                alt=""
              />
            </Link>
            <div className="feed-post__mix-controls__btn">
              <LikeButton onLike={onLike} isLikedLocal={isLikedLocal} />
            </div>
            <span className="feed-post__mix-controls__info">
              {currentLikes}
            </span>
            <button className="feed-post__mix-controls__btn">
              <svg
                width={25}
                viewBox="0 -1 24 24"
                id="meteor-icon-kit__regular-comments"
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
                    d="M8 13H6.35758L3.26816 15.5333C2.41403 16.2337 1.15385 16.1091 0.453464 15.2549C0.160246 14.8974 0 14.4492 0 13.9868V5C0 2.23858 2.23858 0 5 0H11C13.7614 0 16 2.23858 16 5V6H19C21.7614 6 24 8.23858 24 11V19.9868C24 20.4492 23.8398 20.8974 23.5465 21.2549C22.8462 22.1091 21.586 22.2337 20.7318 21.5333L17.6424 19H13C10.2386 19 8 16.7614 8 14V13zM8 11C8 8.23858 10.2386 6 13 6H14V5C14 3.34315 12.6569 2 11 2H5C3.34315 2 2 3.34315 2 5V13.9868L5.64242 11H8zM13 8C11.3431 8 10 9.3431 10 11V14C10 15.6569 11.3431 17 13 17H18.3576L22 19.9868V11C22 9.3431 20.6569 8 19 8H13z"
                    fill="#212121"
                  ></path>
                </g>
              </svg>
            </button>
            <span className="feed-post__mix-controls__info">
              {commentsCount}
            </span>
            <button
              className={`feed-post__mix-controls__btn ${
                isSavedLocal && "feed-post__mix-controls__btn--saved"
              }`}
              onClick={() => (!isSavedLocal ? onSave() : unSave())}
            >
              <svg width="25px" height="23px" viewBox="0 0 24 24" version="1.1">
                <g id="Icon">
                  <path d="M19.75,4.042c0,-0.739 -0.288,-1.447 -0.8,-1.969c-0.517,-0.528 -1.219,-0.823 -1.95,-0.823l-10,0c-0.731,0 -1.433,0.295 -1.95,0.823c-0.512,0.522 -0.8,1.23 -0.8,1.969c0,3.853 -0,12.951 0,16.937c-0,0.692 0.398,1.318 1.013,1.606c0.625,0.294 1.36,0.19 1.882,-0.266l4.698,-4.112c0.09,-0.079 0.224,-0.079 0.314,0l4.698,4.112c0.522,0.456 1.257,0.56 1.882,0.266c0.615,-0.288 1.013,-0.914 1.013,-1.606l-0,-16.937Z"></path>
                </g>
              </svg>
            </button>
          </div>
          <MixComments id={id} />
        </div>
      )}
    </div>
  );
};
