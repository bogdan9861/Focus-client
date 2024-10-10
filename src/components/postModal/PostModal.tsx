import Modal from "antd/es/modal/Modal";
import React, { useState } from "react";
import { Form, notification } from "antd";
import FileInput from "../FileInput/FileInput";
import noPhoto from "../../assets/images/no-image-large.png";

import "./postModal.scss";
import { usePostMutation } from "../../app/service/posts";
import { Notification } from "../UpdateForm/UpdateModal";

type Props = {
  oppen: boolean;
  onCancel: () => void;
  setOppenModal: (arg: boolean) => void;
};

const PostModal = ({ oppen, onCancel, setOppenModal }: Props) => {
  const [url, setUrl] = useState();
  const [formData, setFormData] = useState();
  const [file, setFile] = useState();

  const [doPost] = usePostMutation();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({ duration, description }: Notification) => {
    api.open({
      message: "Уведомление",
      placement: "topLeft",
      description,
      duration,
    });
  };

  const doUpload = async () => {
    try {
      await doPost(formData).unwrap();
      setOppenModal(false);
      openNotification({
        description: "Фото опубликованно",
        duration: 3,
      });
    } catch (error: any) {
      if (error?.data?.message) {
        openNotification({
          description: `${error?.data?.message}`,
          duration: 3,
        });
      } else {
        openNotification({
          description: "Произошла ошибка",
          duration: 3,
        });
      }
      console.log(error);
    }
  };

  return (
    <Modal open={oppen} onCancel={onCancel}>
      <div className="postModal">
        <Form>
          <img className="postModal__img" src={url || noPhoto} alt="" />
          <FileInput
            setFormData={setFormData}
            setUrl={setUrl}
            setFile={setFile}
            name={"image"}
          />
          <button className="send__btn" onClick={() => doUpload()}>
            Опубликовать
          </button>
        </Form>
      </div>
    </Modal>
  );
};

export default PostModal;
