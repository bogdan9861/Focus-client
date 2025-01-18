import React, { useEffect, useState } from "react";
import "../feed/Feed.scss";
import {
  useCommentMutation,
  useGetCommentsMutation,
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

type Props = {
  id: string;
  userId: string;
  name: string;
  url: string;
  status: string;
  profileURL: string;
  self: boolean;
  likes: string;
};

type Comment = {
  id: string;
  postId: string;
  name: string;
  nickname: string;
  text: string;
};

export const Post = ({
  id,
  userId,
  name,
  url,
  profileURL,
  self,
  likes,
  status,
}: Props) => {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
              Вы уверенны,что хоите удалить этот пост?
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
      <img className="feed__post-img" src={url} alt="" />
      <Comments
        id={id}
        setCommentsCount={setCommentsCount}
        oppenComment={oppenComment}
        setOppenComment={setOppenComment}
      />

      <div className="feed__post-statistic">
        <button className="feed__post-statistic-btn" onClick={() => onLike()}>
          <svg
            width="27.000000"
            height="27.000000"
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
          <span className="likes-count">{currentLikes}</span>
        </button>
        <button
          className="feed__post-statistic-btn"
          onClick={() => setOppenComment(!oppenComment)}
        >
          <svg
            width="24.000000"
            height="24.000000"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <desc>Created with Pixso.</desc>
            <defs />
            <path
              id="path"
              d="M11.99 2C6.42 2 1.71 5.65 1.71 10C1.71 12.32 3.05 14.54 5.37 16.07L6.53 16.85L6.17 18.35C5.91 19.46 5.58 20.32 5.23 21.04C6.58 20.39 7.82 19.5 8.91 18.37L9.49 17.78L10.25 17.87C10.83 17.95 11.42 18 11.99 18C17.57 18 22.28 14.34 22.28 10C22.28 5.65 17.57 2 11.99 2ZM23.99 10C23.99 15.53 18.62 20 11.99 20C11.34 20 10.68 19.95 10.05 19.87C8.3 21.68 6.21 22.96 3.89 23.65C3.41 23.81 2.89 23.92 2.36 24C2.1 24 1.79 23.75 1.72 23.4C1.66 23.01 1.88 22.76 2.08 22.48C2.93 21.37 3.89 20.43 4.52 17.82C1.76 16 0 13.17 0 10C0 4.46 5.37 0 12 0C18.62 0 23.99 4.46 23.99 10Z"
              fill="#000000"
              fillOpacity="1.000000"
              fillRule="nonzero"
            />
          </svg>
          <span className="comments-count">{commentsCount}</span>
        </button>
      </div>
    </div>
  );
};

const Comments = ({ id, setCommentsCount, oppenComment, setOppenComment }) => {
  const [sendID] = useGetCommentsMutation();
  const [doComment] = useCommentMutation();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    setCommentsCount(comments.length);
  }, [comments]);

  const writeComment = async () => {
    try {
      const data = await doComment({ id, message: commentText }).unwrap();
      setComments([...comments, data]);
      setOppenComment(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const data = await sendID(id).unwrap();

      setComments(data);
      setCommentsCount(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="feed__comments">
      <ul className="feed__comments-list">
        {comments.map((comment: any) => {
          return (
            <li className="feed__comments-item" key={comment?.id}>
              <div className="feed__comments-inner">
                <span className="feed__comments-name">
                  @{comment?.nickname || comment?.name}
                </span>
                <p className="feed__comments-message">{comment?.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
      {oppenComment ? (
        <div className="feed__comments-input-wrapper">
          <input
            className="feed__comments-input"
            placeholder="Оставьте коментарий"
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="feed__comments-btn" onClick={() => writeComment()}>
            ok
          </button>
        </div>
      ) : null}
    </div>
  );
};
