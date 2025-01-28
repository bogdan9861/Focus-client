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

const ChatsList = ({ id, self, socket }) => {
  const chatsSelector = useSelector(selectChats);
  const [isSearchOppen, setIsSearchOppen] = useState(false);
  const [width, setWidth] = useState(null);

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
    try {
      const res = await doGetChat(id).unwrap();
      console.log(res);

      getHistory(id);

      socket.emit("join-room", id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setWidth(localStorage.getItem("focus-aside-width"));
  }, []);

  useEffect(() => {
    const aside = document.querySelector(".chat__aside");
    let timer;
    let mouseDown;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;

      mouseDown = true;
    };

    const onMouseUp = (e) => {
      if (e.button !== 0) return;

      mouseDown = false;
    };

    aside.addEventListener("mousedown", onMouseDown);
    aside.addEventListener("mouseup", onMouseUp);

    const observer = new ResizeObserver(() => {
      if (!mouseDown) return;

      if (aside.clientWidth != width) {
        clearTimeout(timer);

        timer = setTimeout(() => {
          localStorage.setItem("focus-aside-width", aside.clientWidth);
        }, 1000);
      }
    });

    observer.observe(aside);

    return () => {
      observer.unobserve(aside);
      clearTimeout(timer);

      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <aside className="chat__aside" style={{ width: `${width}px` }}>
      <div className="chat__aside-wrapper">
        <h1 className="chat__aside-title">Сообщения</h1>
      </div>

      <ul className="chat__aside-list">
        {chatsSelector?.map((chat) => {
          return (
            <li className="chat__aside-item" onClick={() => getChat(chat.id)}>
              <img
                className="chat__aside-item__img"
                src={
                  (self(chat.userID_1)
                    ? `${process.env.REACT_APP_SERVER_URL}/${chat.user_2_photo}`
                    : `${process.env.REACT_APP_SERVER_URL}/${chat.user_1_photo}`) ||
                  noPhoto
                }
                alt=""
              />
              <div className="chat__aside-item__content">
                <span className="chat__aside-item__name">
                  {self(chat.userID_1)
                    ? chat.user_2_name
                    : chat.user_1_name || "No name"}
                </span>
                <p className="chat__aside-item__message">123</p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ChatsList;
