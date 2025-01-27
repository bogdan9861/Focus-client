import React, { useEffect, useState } from "react";
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

import Comments from "../comments/Comments";

import noPhoto from "../../assets/images/no-photo.png";
import { Link } from "react-router-dom";
import { Modal, notification } from "antd";

export const Post = ({
  id,
  userId,
  name,
  url,
  profileURL,
  self,
  likes,
  status,
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
        description: "Пост удвлён из сохранённых",
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

  return (
    <div className="feed__post">
      {contextHolder}
      <div className="feed__post-top">
        <Link className="feed__post-profile" to={`/profile/${userId}`}>
          <img
            className="feed__post-profile__img"
            src={profileURL || noPhoto}
            alt=""
          />
          <div className="feed__post-profile-info">
            <span className="feed__post-profile-name">{name}</span>
            <span className="feed__post-profile-status">{status}</span>
          </div>
        </Link>
        <div className="feed__post-menu-wrapper">
          <button
            className="feed__post-menu-btn"
            onClick={() => setOppenMenu(!oppenMenu)}
          >
            <svg
              width="5.000000"
              height="23.000000"
              viewBox="0 0 5 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <desc>Created with Pixso.</desc>
              <defs />
              <circle
                id="Эллипс 4"
                cx="2.500000"
                cy="2.500000"
                r="2.500000"
                fill="#5B5B5B"
                fillOpacity="1.000000"
              />
              <circle
                id="Эллипс 5"
                cx="2.500000"
                cy="11.500000"
                r="2.500000"
                fill="#5B5B5B"
                fillOpacity="1.000000"
              />
              <circle
                id="Эллипс 6"
                cx="2.500000"
                cy="20.500000"
                r="2.500000"
                fill="#5B5B5B"
                fillOpacity="1.000000"
              />
            </svg>
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
            <img className="remove-alert__img" src={url} alt="" />
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

      <img
        className="feed__post-img"
        src={url}
        alt=""
        onClick={() => setPhotoViewOpen(true)}
      />

      <div className="feed__post-statistic">
        <button className="feed__post-statistic-btn" onClick={() => onLike()}>
          <svg
            width="auto"
            height="auto"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <desc>Created with Pixso.</desc>
            <defs>
              <clipPath id="clip2_86">
                <rect
                  id="heart"
                  width="27.000000"
                  height="27.000000"
                  fill="white"
                  fillOpacity="0"
                />
              </clipPath>
            </defs>
            <g clipPath="url(#clip2_86)">
              <path
                id="path"
                d="M22.64 5.98C23.63 6.97 24.13 8.26 24.13 9.56C24.13 10.86 23.63 12.15 22.64 13.14L13.5 22.29L4.35 13.14C3.36 12.15 2.86 10.86 2.86 9.56C2.86 8.26 3.36 6.97 4.35 5.98C5.33 4.99 6.63 4.49 7.93 4.49C9.22 4.49 10.52 4.99 11.51 5.98L12.7 7.17C13.14 7.61 13.85 7.61 14.29 7.17L15.49 5.97C16.47 4.99 17.77 4.49 19.06 4.49C20.36 4.49 21.66 4.99 22.64 5.98ZM24.24 4.39C22.81 2.96 20.93 2.24 19.06 2.24C17.2 2.24 15.32 2.96 13.89 4.38L13.5 4.78L13.1 4.39C11.67 2.96 9.8 2.24 7.93 2.24C6.06 2.24 4.18 2.96 2.75 4.39C1.33 5.81 0.61 7.69 0.61 9.56C0.61 11.43 1.33 13.3 2.75 14.73L12.7 24.67C13.14 25.11 13.85 25.11 14.29 24.67L24.24 14.73C25.66 13.3 26.38 11.43 26.38 9.56C26.38 7.69 25.67 5.82 24.24 4.39Z"
                fill={isLikedLocal ? "#e00" : "#000"}
                fillOpacity="1.000000"
                fillRule="nonzero"
              />
            </g>
          </svg>
        </button>
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
    </div>
  );
};
