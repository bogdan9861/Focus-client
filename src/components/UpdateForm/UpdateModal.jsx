import { useState } from "react";
import { Divider, Form, Input, Modal, notification } from "antd";

import FileInput from "../FileInput/FileInput";
import {
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from "../../app/service/user";

import { toProxyPath } from "../../utils/toProxyPath";
import noPhoto from "../../assets/images/no-photo.png";
import "./UpdateModal.scss";
import { setPhoto } from "../../utils/setPhoto";

const UpdateModal = ({ data, oppen, onCancel, setOppenModal }) => {
  const [url, setUrl] = useState("");
  const [formData, setFormData] = useState();
  const [file, setFile] = useState("");
  const [localData, setLocalData] = useState({
    name: data.name,
    nickname: data.nickname,
    about: data.about,
    status: data.status,
  });

  const [doUpdate] = useUpdateUserMutation();
  const [doUploadAvatar] = useUploadAvatarMutation();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({ duration, description }) => {
    api.open({
      message: "Уведомление",
      placement: "topLeft",
      description,
      duration,
    });
  };

  const onUppdate = async () => {
    try {
      await doUpdate(localData).unwrap();

      if (formData) {
        await doUploadAvatar(formData).unwrap();
      }

      setOppenModal(false);

      openNotification({
        description: "Данные обновлены",
        duration: 3,
      });
    } catch (error) {
      if (error?.originalStatus === 413) {
        openNotification({
          duration: 5,
          description: "Слишком большой размер изображения",
        });
      }
    }
  };

  return (
    <Modal open={oppen} onCancel={onCancel} width={"720px"}>
      {contextHolder}
      <div className="update">
        <div className="update__profile">
          <img className="update__img" src={data?.photo} alt="" />
          <div className="update__profile-content">
            <span className="update__profile-name">{data?.name}</span>
            <span className="update__profile-nickName">{data?.nickname}</span>

            <FileInput
              width={"auto"}
              label={"Изменить фото"}
              setUrl={setUrl}
              setFormData={setFormData}
              setFile={setFile}
              name="avatar"
            />
          </div>
        </div>
        <Divider />
        <p className="update__form-title">Изменить данные</p>
        <Form onFinish={onUppdate}>
          <Form.Item name="name" initialValue={localData.name}>
            <input
              className="update__input"
              placeholder="Введите имя"
              onChange={(e) =>
                setLocalData({ ...localData, name: e.target.value })
              }
              maxLength={50}
            />
          </Form.Item>

          <Form.Item name="nickname" initialValue={localData.nickname}>
            <input
              className="update__input"
              placeholder="Введите никнейм"
              value={localData.nickname}
              onChange={(e) =>
                setLocalData({ ...localData, nickname: e.target.value })
              }
              maxLength={50}
            />
          </Form.Item>

          <Form.Item name="about" initialValue={localData.about}>
            <input
              className="update__input"
              placeholder="город"
              value={localData.about}
              onChange={(e) =>
                setLocalData({ ...localData, about: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item name="status" initialValue={localData.status}>
            <textarea
              maxLength={300}
              className="update__input update__textarea"
              placeholder="Введите статус"
              value={localData.status}
              onChange={(e) =>
                setLocalData({ ...localData, status: e.target.value })
              }
            />
          </Form.Item>
          <button className="send__btn update__from-btn" type="submit">
            обновить данные
          </button>
        </Form>
      </div>
    </Modal>
  );
};

export default UpdateModal;
