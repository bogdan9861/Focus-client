import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form as AntdForm } from "antd";

import AudioRecordButton from "../../../components/AudioRecordButton/AudioRecordButton";
import AudioLock from "../../../components/AudioLock/AudioLock";
import FileInput from "../../../components/FileInput/FileInput";

import { getTime } from "../../../utils/getTime";

import {
  selectChat,
  sendMessage as sendMessageAction,
  setStatus,
} from "../../../features/chat";

import {
  useCreateChatMutation,
  useGetChatsMutation,
  useSendMessageMutation,
} from "../../../app/service/chat";

const Form = ({ id, canWrite, socket, currentChatUserId, openedUser }) => {
  const [doSendMessage] = useSendMessageMutation();
  const [doCreateChat] = useCreateChatMutation();
  const [doGetChats] = useGetChatsMutation();

  const [file, setFile] = useState();
  const [message, setMessage] = useState("");

  const chatSelector = useSelector(selectChat);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("get-status", ({ status, writerId }) => {
      if (currentChatUserId === writerId) {
        dispatch(setStatus(status));
      }
    });

    return () => {
      socket.off("get-status");
    };
  }, [currentChatUserId]);

  const changeStatus = (status) => {
    socket.emit("send-status", chatSelector?.id, id, status);
  };

  useEffect(() => {
    let timer;

    if (message) {
      clearTimeout(timer);
      changeStatus("печатает");
    }

    timer = setTimeout(() => {
      changeStatus("");
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const getChats = async (params) => {
    try {
      return await doGetChats().unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    socket.on("recive-message", ({ message, time, userId, audio }) => {
      dispatch(sendMessageAction({ message, time, userId, audio }));
    });

    return () => {
      socket.off("recive-message");
    };
  }, []);

  const sendMessage = async (audio) => {
    const time = getTime();

    const send = async (chatId) => {
      dispatch(sendMessageAction({ message, time, userId: id, audio }));
      socket.emit("send-message", chatSelector?.id, message, time, id, audio);

      if (!audio) {
        try {
          await doSendMessage({
            text: message,
            chatId,
          }).unwrap();
        } catch (error) {
          console.log(error);
        }
      }

      setMessage("");
    };

    if (openedUser?.data?.id) {
      try {
        const chat = await doCreateChat(openedUser?.data?.id).unwrap();
        getChats();

        send(chat.id, openedUser?.data?.id);
      } catch (error) {
        console.log(error);
      }

      return;
    }

    if (message || audio) {
      send(chatSelector.id);
    }
  };

  return (
    <AntdForm className="chat-body__form" hidden={!canWrite}>
      <AudioLock />
      <div className="chat-body__form-inner">
        <FileInput width={50} setFormData={setFile}>
          <div className="chat-body__form-file">
            <img
              className="chat-body__form__btn-img"
              src="https://img.icons8.com/?size=100&id=16028&format=png&color=aaaaaa"
              alt=""
            />
          </div>
        </FileInput>
        <input
          className="chat-body__form-input"
          placeholder="Введите текст сообщения..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        {message ? (
          <button
            className="chat-body__form-submit"
            onClick={() => sendMessage()}
          >
            <img
              className="chat-body__form__btn-img"
              src="https://img.icons8.com/?size=100&id=IISmtYu065Oa&format=png&color=aaaaaa"
              alt="send"
            />
          </button>
        ) : (
          <AudioRecordButton
            chatId={chatSelector?.id}
            sendMessage={sendMessage}
            changeStatus={changeStatus}
          />
        )}
      </div>
    </AntdForm>
  );
};

export default Form;
