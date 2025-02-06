import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toProxyPath } from "../../../utils/toProxyPath";
import { selectChats } from "../../../features/chat";
import {
  useGetChatByIdMutation,
  useGetHistoryMutation,
} from "../../../app/service/chat";

import noPhoto from "../../../assets/images/no-photo.png";
import { setPhoto } from "../../../utils/setPhoto";

const ChatsList = ({
  id,
  self,
  socket,
  setAsideVisable,
  visable = true,
  setVisable,
}) => {
  const chatsSelector = useSelector(selectChats);

  const [doGetChat] = useGetChatByIdMutation();
  const [doGetHistory] = useGetHistoryMutation();

  const getHistory = async (id) => {
    try {
      return await doGetHistory(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const getChat = async (id) => {
    if (window.screen.width <= 770) {
      setVisable(false);
    }

    try {
      await doGetChat(id).unwrap();

      getHistory(id);
      socket.emit("join-room", id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className={`chat__aside ${!visable ? "chat__aside--hidden" : ""}`}>
      <div className="chat__aside-wrapper">
        <button
          className="header__burger"
          onClick={() => setAsideVisable(true)}
        >
          <svg
            width={"100%"}
            viewBox="0 0 24 24"
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
                d="M4 18H10"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
              <path
                d="M4 12L16 12"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
              <path
                d="M4 6L20 6"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
        </button>

        <svg
          className="chat-body__head-arrow"
          width={30}
          height={30}
          fill="#000000"
          version="1.1"
          id="Layer_1"
          viewBox="0 0 100 100"
          enable-background="new 0 0 100 100"
          style={{
            transform: `rotate(${visable ? "0" : "180"}deg)`,
          }}
          onClick={() => setVisable(false)}
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path d="M33.934,54.458l30.822,27.938c0.383,0.348,0.864,0.519,1.344,0.519c0.545,0,1.087-0.222,1.482-0.657 c0.741-0.818,0.68-2.083-0.139-2.824L37.801,52.564L64.67,22.921c0.742-0.818,0.68-2.083-0.139-2.824 c-0.817-0.742-2.082-0.679-2.824,0.139L33.768,51.059c-0.439,0.485-0.59,1.126-0.475,1.723 C33.234,53.39,33.446,54.017,33.934,54.458z"></path>
            </g>
          </g>
        </svg>
        <h1 className="chat__aside-title">Сообщения</h1>
      </div>

      <ul className="chat__aside-list">
        {chatsSelector?.map((chat) => {
          return (
            <li
              className="chat__aside-item"
              key={chat.id}
              onClick={() => getChat(chat.id)}
            >
              {chat.users.length > 2 ? (
                <>
                  <img
                    className="chat__aside-item__img"
                    src={setPhoto(chat?.photo)}
                    alt=""
                  />
                  <div className="chat__aside-item__content">
                    <span className="chat__aside-item__name">{chat?.name}</span>
                    <p className="chat__aside-item__message">
                      {chat?.lastMessage}
                    </p>
                  </div>
                </>
              ) : (
                chat.users.map(({ user }) => {
                  if (user.id === id) return;
                  return (
                    <>
                      <img
                        className="chat__aside-item__img"
                        src={setPhoto(user.photo)}
                        alt=""
                      />
                      <div className="chat__aside-item__content">
                        <span className="chat__aside-item__name">
                          {user.nickname}
                        </span>
                        <p className="chat__aside-item__message">
                          {chat?.lastMessage}
                        </p>
                      </div>
                    </>
                  );
                })
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ChatsList;
