import { io } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useGetChatByRecipientIdMutation } from "../../app/service/chat";

import Form from "./Form/Form";
import Aside from "./Aside/Aside";

import DotsAnimation from "../../components/DotsAnimation/DotsAnimation";
import ScrollDown from "../../components/scrollDown/ScrollDown";

import { useGetUserByIDQuery } from "../../app/service/user";
import { toProxyPath } from "../../utils/toProxyPath";

import { setStatus } from "../../features/chat";
import { selectChat, selectHistory } from "../../features/chat";

import "./Chat.scss";

const socket = io("http://localhost:5050");

const Chat = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const openedUser = useGetUserByIDQuery(state?.recipientId || "");

  const [doGetRecipientChat] = useGetChatByRecipientIdMutation();

  const chatSelector = useSelector(selectChat);
  const historySelector = useSelector(selectHistory);
  const [canWrite, setCanWrite] = useState(false);
  const [historyScrollData, setHistoryScrollData] = useState({
    current: 0,
    max: 0,
  });
  const [currentChatUserId, setCurrentChatUserId] = useState(null);

  const status = useSelector((state) => state.chat.status);

  const dispatch = useDispatch();

  useEffect(() => {
    setCanWrite(!!chatSelector);
  }, [chatSelector]);

  useEffect(() => {
    if (!!openedUser?.data) {
      setCanWrite(!!openedUser?.data);
    }
  }, [openedUser]);

  useEffect(() => {
    if (openedUser?.data?.id) {
      const gitRecipientHistory = async () => {
        try {
          await doGetRecipientChat(openedUser?.data?.id);
        } catch (error) {
          console.log(error);
        }
      };

      gitRecipientHistory();
    }
  }, [openedUser?.data?.id]);

  const scrollDown = () => {
    const list = document.querySelector(".chat-body__messages");
    list.scrollTo({ top: list.scrollHeight, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let chatUserId =
      id == chatSelector?.userID_1
        ? chatSelector?.userID_2
        : chatSelector?.userID_1;

    setCurrentChatUserId(chatUserId);
    dispatch(setStatus(""));
  }, [chatSelector]);

  useEffect(() => {
    scrollDown();
  }, [chatSelector, historySelector]);

  const playAudio = (e) => {
    const target = e.target;
    const audio = target.children[0];
    const isPlaying = target.className.includes("active");

    if (isPlaying) {
      audio.pause();
      target.classList.remove("active");
    } else {
      target.classList.add("active");
      audio.play();
    }
  };

  const self = (userId) => {
    return id === userId;
  };

  return (
    <div className="chat">
      <Aside id={id} self={self} socket={socket} />
      <div className="chat-body">
        <div className="chat-body__head">
          <h2 className="chat-body__head-name">
            {openedUser?.data?.nickname ||
              (self(chatSelector?.userID_1)
                ? chatSelector?.user_2_name
                : chatSelector?.user_1_name || "Select chat")}
          </h2>
          <span className="chat-body__head-status">
            {status !== "" ? <DotsAnimation /> : null}
            {chatSelector ? (status !== "" ? status : "Был(а) недавно") : null}
          </span>
        </div>
        <div className="chat-body__wrapper">
          <div className="chat-body__inner">
            <ul
              className="chat-body__messages"
              onScroll={(e) => {
                setHistoryScrollData({
                  current: e.target.scrollTop,
                  max: e.target.scrollHeight - e.target.clientHeight,
                });
              }}
            >
              {historySelector?.map((el, i) => {
                return (
                  <li
                    className={`chat-body__message fallDown ${
                      el.userId === id ? "self" : ""
                    }`}
                    key={i}
                  >
                    {el?.audio ? (
                      <button
                        className="chat-body__message-play"
                        onClick={(e) => playAudio(e)}
                      >
                        <audio
                          src={toProxyPath(el?.audio)}
                          onEnded={(e) =>
                            e.target.parentElement.classList.remove("active")
                          }
                        />
                        <img
                          className="play"
                          src="https://img.icons8.com/?size=100&id=99cTBfGlewZU&format=png&color=5088df"
                          alt=""
                        />
                        <img
                          className="pause"
                          src="https://img.icons8.com/?size=100&id=61012&format=png&color=5088df"
                          alt=""
                        />
                      </button>
                    ) : (
                      <p className="chat-body__message-text">{el.message}</p>
                    )}

                    <p className="chat-body__message-time">{el.time}</p>
                  </li>
                );
              })}
            </ul>
            <ScrollDown scroll={historyScrollData} scrollDown={scrollDown} />
          </div>

          <Form
            id={id}
            canWrite={canWrite}
            socket={socket}
            currentChatUserId={currentChatUserId}
            openedUser={openedUser}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
