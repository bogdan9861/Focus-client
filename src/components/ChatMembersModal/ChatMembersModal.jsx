import React from "react";

import { Modal } from "antd";
import { Link } from "react-router-dom";
import { setPhoto } from "../../utils/setPhoto";

import "../UsersModal/UsersModal.scss";

const ChatMembersModal = ({ users, open, setOpen }) => {

  return (
    <Modal open={open} onCancel={() => setOpen(false)}>
      <ul className="users__list">
        {users?.map(({ user }) => (
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
    </Modal>
  );
};

export default ChatMembersModal;
