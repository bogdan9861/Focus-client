import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  useGetUserFollowsQuery,
  useUnsubMutation,
} from "../../app/service/user";
import Loader from "../loader/Loader";

import "./FollowsModal.scss";
import { Link } from "react-router-dom";

const FollowsModal = ({ title, open, setOpen, id }) => {
  const follows = useGetUserFollowsQuery(id);
  const [doUnfollow] = useUnsubMutation();

  const onUnsub = async (id) => {
    try {
      await doUnfollow(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal title={title} open={open} onCancel={() => setOpen(false)}>
      {follows.isLoading ? (
        <Loader />
      ) : (
        <ul className="followers__list">
          {follows.data.map((user) => (
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
              <button
                className="followers__list-btn"
                onClick={() => onUnsub(user?.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default FollowsModal;
