import React, { useEffect } from "react";

import bell from "../../assets/images/bell.svg";
import message from "../../assets/icons/message.svg";
import noPhoto from "../../assets/images/no-photo.png";

import "./Header.scss";
import { selectUser, useCurrentQuery } from "../../app/service/auth";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";

const Header = ({ setAsideVisable }) => {
  const { data, isLoading } = useCurrentQuery();
  const user = useSelector(selectUser);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <header className="header">
      <div className="header__inner">
        <ul className="header__stories">
          <li className="header__stories-item">
            <a className="header__stories-link" href="#">
              <img
                className="header__stories-img"
                style={{ width: "30px", height: "30px" }}
                src="https://img.icons8.com/?size=100&id=16148&format=png&color=d82a60"
                alt=""
              />
            </a>
          </li>
          {/*          
            <li className="header__stories-item">
              <a className="header__stories-link" href="#">
                <img className="header__stories-img" src="" alt="" />
                <span className="header__stories-name">Александр</span>
              </a>
            </li> */}
        </ul>
        <button
          className="header__burger"
          onClick={() => setAsideVisable(true)}
        >
          <svg
            width={"100%"}
            viewBox="0 0 24 24"
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
                d="M4 18H10"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
              <path
                d="M4 12L16 12"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
              <path
                d="M4 6L20 6"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
        </button>
        <div className="header__profile">
          <Link className="header__prfile-user" to={`/profile/${user?.id}`}>
            <img
              className="header__profile-img"
              src={
                `${process.env.REACT_APP_SERVER_URL}/${data?.photo}` || noPhoto
              }
              alt=""
            />
            <div className="header__profile-info">
              <span className="header__profile-name">{data?.name}</span>
              <span className="header__profile-nickname">{data?.nickname}</span>
            </div>
          </Link>
          <ul className="header__activity">
            <li className="header__activity-item">
              <a className="header__activity-link" href="#">
                <img
                  className="header__activity-img"
                  src={bell}
                  alt="notifications"
                />
              </a>
            </li>
            <li className="header__activity-item">
              <Link className="header__activity-link" to={`/chat/${user?.id}`}>
                <img
                  className="header__activity-img"
                  src={message}
                  alt="messages"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
