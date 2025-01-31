import React, { useEffect, useState } from "react";
import {
  useGetUserFollowersQuery,
  useGetUserFollowsQuery,
  useUnsubMutation,
} from "../../app/service/user";

import { Modal } from "antd";
import { Link } from "react-router-dom";

import Loader from "../loader/Loader";

import "../FollowsModal/FollowsModal.scss";

const FollowersModal = ({ title, open, setOpen, id }) => {
  const followers = useGetUserFollowersQuery(id);

  return (
    <Modal title={title} open={open} onCancel={() => setOpen(false)}>
      {followers.isLoading ? (
        <Loader />
      ) : (
        <ul className="followers__list">
          {followers.data.map((user) => (
            <li className="followers__list-item" onClick={() => setOpen(false)}>
              <Link
                className="followers__list-inner"
                to={`/profile/${user?.id}`}
              >
                <img
                  className="followers__list-img"
                  src={`${process.env.REACT_APP_SERVER_URL}/${user?.photo}`}
                  alt=""
                />
                <div className="followers__list-content">
                  <span className="followers__list-nickname">
                    {user?.nickname}
                  </span>
                  <span className="followers__list-name">{user?.name}</span>
                </div>
              </Link>
              <button className="followers__list-btn">Удалить</button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default FollowersModal;
