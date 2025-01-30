import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form as AntdForm, Button, Modal } from "antd";

import {
  selectChat,
  sendMessage as sendMessageAction,
  setStatus,
} from "../../../features/chat";

import {
  useCreateChatMutation,
  useGetChatsMutation,
  useSendFileMutation,
  useSendMessageMutation,
} from "../../../app/service/chat";

import AudioRecordButton from "../../../components/AudioRecordButton/AudioRecordButton";
import AudioLock from "../../../components/AudioLock/AudioLock";
import FileInput from "../../../components/FileInput/FileInput";

import { getTime } from "../../../utils/getTime";

import fileIcon from "../../../assets/icons/file.svg";

import picture from "../../../assets/icons/picture.svg";

const Form = ({ id, canWrite, socket, currentChatUserId, openedUser }) => {
  const [doSendMessage] = useSendMessageMutation();
  const [doCreateChat] = useCreateChatMutation();
  const [doGetChats] = useGetChatsMutation();
  const [doSendFile] = useSendFileMutation();

  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [fileFormData, setFileFormData] = useState(null);

  const [message, setMessage] = useState("");

  const [confirmOpen, setConfimOpen] = useState(false);

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
    socket.on("recive-message", ({ message, time, userId, audio, file }) => {
      dispatch(sendMessageAction({ message, time, userId, audio, file }));
    });

    return () => {
      socket.off("recive-message");
    };
  }, []);

  const sendMessage = async (audio, file) => {
    const time = getTime();

    const send = async (chatId) => {
      dispatch(sendMessageAction({ message, time, userId: id, audio, file }));
      socket.emit(
        "send-message",
        chatSelector?.id,
        message,
        time,
        id,
        audio,
        file
      );

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

    if (message || audio || file) {
      send(chatSelector.id);
    }
  };

  useEffect(() => {
    if (file) {
      setConfimOpen(true);
    }
  }, [file]);

  const sendFile = async () => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("chatId", chatSelector?.id);

    try {
      const res = await doSendFile(formData).unwrap();
      sendMessage(null, res.path);

      setConfimOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AntdForm className="chat-body__form" hidden={!canWrite}>
      <AudioLock />
      <div className="chat-body__form-inner">
        <FileInput
          width={50}
          setFormData={setFileFormData}
          setFile={setFile}
          setUrl={setUrl}
        >
          <div className="chat-body__form-file">
            <img className="chat-body__form__btn-img" src={picture} alt="" />
          </div>
        </FileInput>
        <Modal
          onCancel={() => setConfimOpen(false)}
          open={confirmOpen}
          title="Отправить файл"
        >
          <>
            {file?.type.split("/").shift() === "image" ? (
              <img src={url} alt="" />
            ) : file?.type.split("/").shift() === "video" ? (
              <video
                src={url}
                controls
                autoPlay
                muted
                playsInline
                style={{ maxWidth: "100%" }}
              />
            ) : (
              <div className="chat-body__confirm-file">
                <div className="chat-body__confirm-file__img">
                  <img src={fileIcon} alt="" />
                </div>
                <div className="chat-body__confirm-file__info">
                  <p>{file?.name}</p>
                  <span className="chat-body__confirm-file__size">
                    {(file?.size / 1048576).toFixed(1)} МБ
                  </span>
                </div>
              </div>
            )}
            <div className="chat-body__confirm-wrapper">
              <button className="chat-body__confirm-btn" onClick={sendFile}>
                Отправить
              </button>
              <button
                className="chat-body__confirm-btn danger"
                onClick={() => setConfimOpen(false)}
              >
                Отмена
              </button>
            </div>
          </>
        </Modal>
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
