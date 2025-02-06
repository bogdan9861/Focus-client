import React from "react";
import { Modal } from "antd";
import { useFollowMutation, useGetAllQuery } from "../../app/service/user";
import { Link } from "react-router-dom";

import Loader from "../loader/Loader";

import "./UsersModal.scss";

import noPhoto from "../../assets/images/no-photo.png";

const UsersModal = ({ data, title, open, setOpen, isLoading }) => {
  const users = useGetAllQuery();
  const [isFollowed] = useFollowMutation();

  const setPhoto = (url) => {
    if (url) {
      return `${process.env.REACT_APP_SERVER_URL}/${url}`;
    } else {
      return noPhoto;
    }
  };

  return (
    <Modal title={title} open={open} onCancel={() => setOpen(false)}>
      {!isLoading ? (
        <ul className="users__list">
          {data?.map((user) => (
            <li className="users__list-item" onClick={() => setOpen(false)}>
              <Link className="users__list-inner" to={`/profile/${user?.id}`}>
                <img
                  className="users__list-img"
                  src={setPhoto(user?.photo)}
                  alt=""
                />
                <div className="users__list-content">
                  <span className="users__list-nickname">{user?.nickname}</span>
                  <span className="users__list-name">{user?.name}</span>
                </div>
              </Link>
              <button className="users__list-btn">Удалить</button>
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
