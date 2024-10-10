import profile from "../../assets/images/profile.png";
import { Form, Input } from "antd";
import { Link } from "react-router-dom";
import arrow from "../../assets/icons/arrow.svg";

import "./Chat.scss";

const Chat = () => {
  return (
    <div className="chat">
      <aside className="chat__aside">
        <div className="chat__aside-top">
          <div className="chat__aside-top__inner">
            <Link to="/">
              <img src="" alt="" />
            </Link>
            <span className="chat__aside-top__text">Messages</span>
          </div>
        </div>
        <ul className="chat__aside-list">
          <li className="chat__aside-item">
            <img className="chat__aside-item__img" src={profile} alt="" />
            <div className="chat__aside-item__content">
              <span className="chat__aside-item__name">Veronika_3190</span>
              <span className="chat__aside-item__message">
                Привет! 😉 ты вообще открыт к новым возможностям?
              </span>
            </div>
          </li>
          <li className="chat__aside-item">
            <img className="chat__aside-item__img" src={profile} alt="" />
            <div className="chat__aside-item__content">
              <span className="chat__aside-item__name">Veronika_3190</span>
              <span className="chat__aside-item__message">
                Привет! 😉 ты вообще открыт к новым возможностям?
              </span>
            </div>
          </li>
          <li className="chat__aside-item">
            <img className="chat__aside-item__img" src={profile} alt="" />
            <div className="chat__aside-item__content">
              <span className="chat__aside-item__name">Veronika_3190</span>
              <span className="chat__aside-item__message">
                Привет! 😉 ты вообще открыт к новым возможностям?
              </span>
            </div>
          </li>
        </ul>
      </aside>
      <div className="chat-body">
        <div className="chat-body__inner">
          <ul className="chat-body__messages">
            <li className="chat-body__message">message</li>
            <li className="chat-body__message self">message</li>
          </ul>
        </div>
        <Form className="chat-body__form">
          <div className="chat-body__form-inner">
            <Form.Item>
              <Input placeholder="Введите текст сообщения" />
            </Form.Item>
            <button>
              <img
                src="https://img.icons8.com/?size=100&id=RHtRRB1E4DKI&format=png&color=000000"
                alt="send"
              />
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
