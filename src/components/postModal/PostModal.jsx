import Modal from "antd/es/modal/Modal";
import React, { useEffect, useRef, useState } from "react";
import { Form, notification } from "antd";

import FileInput from "../FileInput/FileInput";
import { usePostMutation } from "../../app/service/posts";
import noPhoto from "../../assets/icons/PickPhoto.svg";

import "./postModal.scss";
import Loader from "../loader/Loader";

const PostModal = ({ oppen, onCancel, setOppenModal }) => {
  const [url, setUrl] = useState();
  const [formData, setFormData] = useState();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const videoPlayer = useRef(null);

  const [doPost] = usePostMutation();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({ duration, description }) => {
    api.open({
      message: "Уведомление",
      placement: "topLeft",
      description,
      duration,
    });
  };

  useEffect(() => {
    if (oppen === false) {
      setUrl("");
      videoPlayer.current?.pause();
    }
  }, [oppen]);

  const doUpload = async () => {
    try {
      setLoading(true);

      await doPost(formData).unwrap();

      setLoading(false);
      setOppenModal(false);
      openNotification({
        description: "Фото опубликованно",
        duration: 3,
      });
    } catch (error) {
      setLoading(false);

      if (error?.data?.message) {
        openNotification({
          description: `${error?.data?.message}`,
          duration: 3,
        });
      } else {
        setLoading(false);

        openNotification({
          description: "Произошла ошибка",
          duration: 3,
        });
      }
      console.log(error);
    }
  };

  return (
    <Modal
      title={"Создание публикации"}
      open={oppen}
      onCancel={onCancel}
      width={"50%"}
    >
      <div
        className="postModal"
        style={{
          backgroundImage:
            url?.split(";")[0].split("/")[1] !== "mp4" ? `url(${url})` : "",
        }}
      >
        <Form>
          <div className="postModal__form-inner">
            {url ? (
              <>
                <div className="postModal__preview-wrapper">
                  {url?.split(";")[0].split("/")[1] === "mp4" ? (
                    <video
                      ref={videoPlayer}
                      style={{ maxWidth: "100%" }}
                      height={400}
                      controls
                      autoPlay
                      src={url}
                    />
                  ) : null}

                  {!loading ? (
                    <button
                      className="postModal__send"
                      onClick={() => doUpload()}
                    >
                      Опубликовать
                    </button>
                  ) : (
                    <Loader height={"100%"} />
                  )}

                  <svg
                    viewBox="0 0 25 25"
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
                        d="M4.99997 5.50005H20M7.5 14L12.5 9.00003L17.5 14"
                        stroke="#121923"
                        stroke-width="1.2"
                      ></path>
                      <path
                        d="M12.5 9.00003V20"
                        stroke="#121923"
                        stroke-width="1.2"
                      ></path>
                    </g>
                  </svg>
                </div>
              </>
            ) : (
              <>
                <div className="postModal__preview">
                  <img
                    className="postModal__preview-icon"
                    src={noPhoto}
                    alt=""
                  />
                </div>
                <FileInput
                  width={"auto"}
                  setFormData={setFormData}
                  setUrl={setUrl}
                  setFile={setFile}
                  name={"image"}
                >
                  <div className="postModal__preview-filebtn">
                    Выбрать на устройстве
                  </div>
                </FileInput>
              </>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default PostModal;
