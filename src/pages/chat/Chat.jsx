import io from "socket.io-client";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import Form from "./Form/Form";
import ChatsList from "./ChatsList/ChatsList";

import Aside from "../../components/aside/Aside";
import DotsAnimation from "../../components/DotsAnimation/DotsAnimation";
import ScrollDown from "../../components/scrollDown/ScrollDown";
import AudioMessageBtn from "../../components/Messages/AudioMessageBtn/AudioMessageBtn";
import FileMessage from "../../components/Messages/FileMessage/FileMessage";

import { useGetUserByIDQuery } from "../../app/service/user";
import { useGetChatByRecipientIdMutation } from "../../app/service/chat";

import { setStatus } from "../../features/chat";
import { selectChat, selectHistory, closeChat } from "../../features/chat";

import "./Chat.scss";
import PhotoViewer from "../../components/PhotoViewer/PhotoViewer";
import { setPhoto } from "../../utils/setPhoto";
import ChatMembersModal from "../../components/ChatMembersModal/ChatMembersModal";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const openedUser = useGetUserByIDQuery(state?.recipientId);
  const [doGetRecipientChat] = useGetChatByRecipientIdMutation();

  const chatSelector = useSelector(selectChat);
  const historySelector = useSelector(selectHistory);
  const [canWrite, setCanWrite] = useState(false);
  const [historyScrollData, setHistoryScrollData] = useState({
    current: 0,
    max: 0,
  });
  const [currentChatUserId, setCurrentChatUserId] = useState(null);
  const [asideVisable, setAsideVisable] = useState(false);
  const [chatListVisable, setChatListVisable] = useState(true);
  const [membersOpen, setMembersOpen] = useState(false);

  const status = useSelector((state) => state.chat.status);

  const dispatch = useDispatch();

  useEffect(() => {
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      if (navigator.userAgentData.platform !== "iOS") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    socket.emit("auth", id);
  }, []);

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
      const getRecipientHistory = async () => {
        try {
          await doGetRecipientChat(openedUser?.data?.id);
        } catch (error) {
          console.log(error);
        }
      };

      getRecipientHistory();
    }
  }, [openedUser?.data?.id]);

  const scrollDown = () => {
    const list = document.querySelector(".chat-body__messages");
    list.scrollTo({ top: list.scrollHeight, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let chatUserId;

    chatSelector?.users?.forEach(({ user }) => {
      chatUserId = user.id !== id && user.id;
    });

    setCurrentChatUserId(chatUserId);
    dispatch(setStatus(""));
  }, [chatSelector]);

  useEffect(() => {
    scrollDown();
  }, [chatSelector, historySelector]);

  useEffect(() => {
    return () => {
      dispatch(closeChat());
    };
  }, []);

  const self = (userId) => {
    return id === userId;
  };

  return (
    <>
      <Aside
        noResize={true}
        visable={asideVisable}
        setAsideVisable={setAsideVisable}
      />
      <div className="chat">
        <ChatsList
          id={id}
          self={self}
          socket={socket}
          setAsideVisable={setAsideVisable}
          visable={chatListVisable}
          setVisable={setChatListVisable}
        />
        <div className="chat-body">
          <div className="chat-body__head">
            <div className="chat-body__head-wrapper">
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
                  transform: `rotate(${chatListVisable ? "0" : "180"}deg)`,
                }}
                onClick={() => setChatListVisable(!chatListVisable)}
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
              <div className="chat-body__head-inner">
                {chatSelector?.users?.length === 2 ? (
                  chatSelector?.users?.map(({ user }) => {
                    if (user.id === id) return;

                    return (
                      <div className="chat-body__head-info">
                        <img
                          className="chat-body__head-img viewer"
                          src={setPhoto(user.photo)}
                          alt=""
                        />
                        <Link
                          className="chat-body__head-info__content"
                          to={`/profile/${user.id}`}
                        >
                          <h2 className="chat-body__head-name">
                            {user.nickname}
                          </h2>

                          <span className="chat-body__head-status">
                            {status !== "" ? <DotsAnimation /> : null}
                            {chatSelector
                              ? status !== ""
                                ? status
                                : "Был(а) недавно"
                              : null}
                          </span>
                        </Link>
                      </div>
                    );
                  })
                ) : chatSelector?.users?.length > 2 ? (
                  <div className="chat-body__head-info">
                    <img
                      className="chat-body__head-img viewer"
                      src={setPhoto(chatSelector?.photo)}
                      alt=""
                    />
                    <div
                      className="chat-body__head-info__content"
                      onClick={() => setMembersOpen(true)}
                    >
                      <h2 className="chat-body__head-name">
                        {chatSelector?.name}
                      </h2>
                      <span className="chat-body__head-status">
                        {chatSelector?.users.length} участника
                      </span>
                    </div>

                    <ChatMembersModal
                      open={membersOpen}
                      setOpen={setMembersOpen}
                      users={chatSelector?.users}
                    />
                  </div>
                ) : openedUser.data ? (
                  <div className="chat-body__head-info">
                    <img
                      className="chat-body__head-img"
                      src={setPhoto(openedUser.data.photo)}
                      alt=""
                    />
                    <Link
                      className="chat-body__head-info__content"
                      to={`/profile/${openedUser.data.id}`}
                    >
                      <h2 className="chat-body__head-name">
                        {openedUser.data.nickname}
                      </h2>
                      <span className="chat-body__head-status">
                        {status !== "" ? <DotsAnimation /> : null}
                        {chatSelector
                          ? status !== ""
                            ? status
                            : "Был(а) недавно"
                          : null}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="chat-body__head-info">
                    <h2 className="chat-body__head-name">Выберите чат</h2>
                  </div>
                )}
              </div>
            </div>
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
                    <>
                      <li
                        className={`chat-body__message fallDown ${
                          el?.file ? "file" : ""
                        } ${el.userId === id ? "self" : ""}`}
                        key={i}
                      >
                        {el?.file ? (
                          <FileMessage
                            self={el.userId === id}
                            path={el?.file}
                          />
                        ) : el?.audio ? (
                          <AudioMessageBtn
                            self={el.userId === id}
                            url={el.audio}
                          />
                        ) : (
                          <p className="chat-body__message-text">
                            {el.message}
                          </p>
                        )}

                        <p className="chat-body__message-time">{el.time}</p>
                      </li>
                    </>
                  );
                })}
              </ul>
              <ScrollDown scroll={historyScrollData} scrollDown={scrollDown} />
            </div>

            <Form
              id={id}
              chatUserId={currentChatUserId}
              canWrite={canWrite}
              socket={socket}
              currentChatUserId={currentChatUserId}
              openedUser={openedUser}
            />
          </div>
        </div>
      </div>
      <PhotoViewer />
    </>
  );
};

export default Chat;
