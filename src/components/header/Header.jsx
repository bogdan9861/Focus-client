import React, { useEffect } from "react";

import bell from "../../assets/images/bell.svg";
import message from "../../assets/icons/message.svg";
import noPhoto from "../../assets/images/no-photo.png";

import "./Header.scss";
import { selectUser, useCurrentQuery } from "../../app/service/auth";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Header = () => {
  const { data, isLoading } = useCurrentQuery();
  const user = useSelector(selectUser);

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <ul className="header__stories">
            <li className="header__stories-item">
              <a className="header__stories-link" href="#">
                <img className="header__stories-img" src="" alt="" />
                <span className="header__stories-name">Александр</span>
              </a>
            </li>
            <li className="header__stories-item">
              <a className="header__stories-link" href="#">
                <img className="header__stories-img" src="" alt="" />
                <span className="header__stories-name">Александр</span>
              </a>
            </li>
            <li className="header__stories-item">
              <a className="header__stories-link" href="#">
                <img className="header__stories-img" src="" alt="" />
                <span className="header__stories-name">Александр</span>
              </a>
            </li>
            <li className="header__stories-item">
              <a className="header__stories-link" href="#">
                <img className="header__stories-img" src="" alt="" />
                <span className="header__stories-name">Александр</span>
              </a>
            </li>
          </ul>
          <div className="header__profile">
            <Link className="header__prfile-user" to={`/profile/${user?.id}`}>
              <img
                className="header__profile-img"
                src={data?.photo || noPhoto}
                alt=""
              />
              <div className="header__profile-info">
                <span className="header__profile-name">{data?.name}</span>
                <span className="header__profile-nickname">
                  {data?.nickname}
                </span>
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
                <Link
                  className="header__activity-link"
                  to={`/chat/${user?.id}`}
                >
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
      </div>
    </header>
  );
};

export default Header;
