import { useEffect, useState } from "react";
import { Divider, Form, Input, Modal, notification } from "antd";

import FileInput from "../FileInput/FileInput";
import { useUpdateUserMutation } from "../../app/service/user";

import noPhoto from "../../assets/images/no-photo.png";
import "../../pages/Login/Form.scss";
import "./UpdateModal.scss";

type Notification = {
  duration: number;
  description: string;
};

type User = {
  name: string;
  nickname: string;
  photo: string;
  status: string;
  about: string;
};

type Props = {
  data: User;
  oppen: boolean;
  onCancel: () => void;
  setOppenModal: (arg: boolean) => void;
};

const UpdateModal = ({ data, oppen, onCancel, setOppenModal }: Props) => {
  const [url, setUrl] = useState("");
  const [localData, setLocalData] = useState<User>({
    name: data.name,
    nickname: data.nickname,
    photo: "",
    about: "",
    status: "",
  });

  const [doUpdate] = useUpdateUserMutation();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({ duration, description }: Notification) => {
    api.open({
      message: "Уведомление",
      placement: "topLeft",
      description,
      duration,
    });
  };

  useEffect(() => {
    setLocalData({ ...localData, photo: url });
    console.log(url);
  }, [url]);

  const onUppdate = async () => {
    try {
      await doUpdate(localData).unwrap;
      setOppenModal(false);

      openNotification({
        description: "Данные обновлены",
        duration: 3,
      });
    } catch (error: any) {
      if (error?.originalStatus === 413) {
        openNotification({
          duration: 5,
          description: "Слишком большой размер изображения",
        });
      }

      console.log(error);
    }
  };

  return (
    <Modal open={oppen} onCancel={onCancel} width={"720px"}>
      {contextHolder}
      <div className="update">
        <div className="update__profile">
          <img
            className="update__img"
            src={url || data?.photo || noPhoto}
            alt=""
          />
          <div className="update__profile-content">
            <span className="update__profile-name">{data?.name}</span>
            <span className="update__profile-nickName">{data?.nickname}</span>

            <FileInput setUrl={setUrl} />
          </div>
        </div>
        <Divider />
        <p className="update__form-title">Изменить данные</p>
        <Form onFinish={onUppdate}>
          <Form.Item name="name" initialValue={localData.name}>
            <Input
              className="update__input form__input"
              placeholder="Введите имя"
              onChange={(e) =>
                setLocalData({ ...localData, name: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item name="nickname" initialValue={localData.nickname}>
            <Input
              className="update__input form__input"
              placeholder="Введите никнейм"
              value={localData.nickname}
              onChange={(e) =>
                setLocalData({ ...localData, nickname: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item name="status" initialValue={localData.status}>
            <Input.TextArea
              maxLength={300}
              className="update__input form__input"
              placeholder="Введите статус"
              value={localData.status}
              onChange={(e) =>
                setLocalData({ ...localData, status: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item name="about" initialValue={localData.about}>
            <Input
              className="update__input form__input"
              placeholder="Где вы живёте?"
              value={localData.about}
              onChange={(e) =>
                setLocalData({ ...localData, about: e.target.value })
              }
            />
          </Form.Item>
          <button className="update__from-btn" type="submit">
            обновить данные
          </button>
        </Form>
      </div>
    </Modal>
  );
};

export default UpdateModal;
