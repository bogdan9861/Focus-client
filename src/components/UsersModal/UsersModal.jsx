import React from "react";
import { Modal } from "antd";
import { useFollowMutation, useGetAllQuery } from "../../app/service/user";
import { Link } from "react-router-dom";

import Loader from "../loader/Loader";

import "./UsersModal.scss";

import noPhoto from "../../assets/images/no-photo.png";
import { useAddUserToChatMutation } from "../../app/service/chat";

const UsersModal = ({
  data,
  title,
  open,
  setOpen,
  isLoading,
  chatId,
  addUsers = false,
}) => {
  const [addUser] = useAddUserToChatMutation();

  const setPhoto = (url) => {
    if (url) {
      return `${process.env.REACT_APP_SERVER_URL}/${url}`;
    } else {
      return noPhoto;
    }
  };

  const addUserToChat = async (e, id) => {
    try {
      await addUser({ chatId, userId: id }).unwrap();
      e.target.style.display = "none";
    } catch (error) {}
  };

  return (
    <Modal title={title} open={open} onCancel={() => setOpen(false)}>
      {!isLoading ? (
        <ul className="users__list">
          {data?.map((user) => (
            <li
              className="users__list-item"
              onClick={() => !addUser && setOpen(false)}
            >
              <Link className="users__list-inner" to={`/profile/${user?.id}`}>
                <img
                  className="users__list-img"
                  src={user?.photo || noPhoto}
                  alt=""
                />
                <div className="users__list-content">
                  <span className="users__list-nickname">{user?.nickname}</span>
                  <span className="users__list-name">{user?.name}</span>
                </div>
              </Link>
              {addUsers && (
                <button
                  onClick={(e) => addUserToChat(e, user.id)}
                  className="chatmembers__btn"
                  style={{ width: 30, height: 30 }}
                >
                  +
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Loader />
      )}
    </Modal>
  );
};

export default UsersModal;
