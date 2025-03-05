import React, { useEffect, useState } from "react";

import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { setPhoto } from "../../utils/setPhoto";

import "../UsersModal/UsersModal.scss";
import "./ChatMembersModal.scss";
import UsersModal from "../UsersModal/UsersModal";
import { useGetAllQuery } from "../../app/service/user";
import { useRemoveUserFromChatMutation } from "../../app/service/chat";

const ChatMembersModal = ({ chatId, users, open, setOpen, actionButton }) => {
  const [usersOpen, setUsersOpen] = useState(false);
  const { data, isLoading } = useGetAllQuery();
  const [removeUser] = useRemoveUserFromChatMutation();

  const onRemoveUser = async (id) => {
    try {
      await removeUser({ chatId, userId: id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal title={"Участники"} open={open} onCancel={() => setOpen(false)}>
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
              <button
                className="users__list-btn"
                onClick={() => onRemoveUser(user.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
        <button
          className="chatmembers__btn"
          onClick={() => {
            setUsersOpen(true);
            setOpen(false);
          }}
        >
          +
        </button>
      </Modal>
      <UsersModal
        chatId={chatId}
        addUsers={true}
        isLoading={isLoading}
        data={data}
        open={usersOpen}
        setOpen={setUsersOpen}
      />
    </>
  );
};

export default ChatMembersModal;
