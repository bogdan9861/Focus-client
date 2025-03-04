import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../features/auth";
import { useCurrentUserQuery, useGetAllQuery } from "../../app/service/user";

import PostModal from "../postModal/PostModal";
import UsersModal from "../UsersModal/UsersModal";

import shortLogo from "../../assets/images/short-logo.svg";
import logo from "../../assets/images/logo.svg";
import home from "../../assets/icons/home.svg";
import add from "../../assets/icons/add.svg";
import profile from "../../assets/icons/profile.svg";
import friends from "../../assets/icons/friends.svg";
import mixes from "../../assets/icons/mixes.svg";

import "./Aside.scss";

const Aside = ({
  open,
  noResize = null,
  visable = false,
  setAsideVisable = null,
  black = false,
}) => {
  const [oppenPostModal, setOppenPostModal] = useState(false);
  const user = useCurrentUserQuery();
  const users = useGetAllQuery();

  const [friendsOpen, setFriendsOpen] = useState(false);

  const aside = useRef(null);

  const dispatch = useDispatch();
  const collapseWidth = useRef(1205);

  const onLogout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.href = "/";
  });

  const handleResize = () => {
    if (noResize) return;

    const aside = document.querySelector(".aside");

    if (document.body.clientWidth <= collapseWidth.current) {
      aside?.classList.remove("aside--active");
    } else {
      aside?.classList.add("aside--active");
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [window.location.pathname]);

  useEffect(() => {
    if (visable) {
      aside.current.classList.add("aside--visable");
    } else {
      aside.current.classList.remove("aside--visable");
    }
  }, [visable]);

  return (
    <div
      ref={aside}
      className={
        `aside ${open ? "aside--active" : ""}` + ` ${black && "aside--black"}`
      }
    >
      <div className="logo__wrapper" onClick={() => setAsideVisable(false)}>
        {open ? (
          <picture>
            <source
              srcSet={shortLogo}
              media={`(max-width: ${collapseWidth.current}px`}
              style={{
                width: "10px",
                height: "10px",
                display: "block",
              }}
            />
            <img src={logo} alt="" />
          </picture>
        ) : (
          <img
            src={shortLogo}
            style={{
              width: "30px",
              height: "30px",
              display: "block",
            }}
            alt=""
          />
        )}
      </div>
      <div className="aside__inner">
        <nav className="menu">
          <ul className="menu__list">
            <li className="menu__list-item">
              <Link className="menu__list-link" to={"/"}>
                <svg width="10px" height="10px" viewBox="0 0 15 15" fill="none">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M7.5 0.5L7.8254 0.120372C7.63815 -0.0401239 7.36185 -0.0401239 7.1746 0.120372L7.5 0.5ZM0.5 6.5L0.174604 6.12037L0 6.27003V6.5H0.5ZM5.5 14.5V15C5.77614 15 6 14.7761 6 14.5H5.5ZM9.5 14.5H9C9 14.7761 9.22386 15 9.5 15V14.5ZM14.5 6.5H15V6.27003L14.8254 6.12037L14.5 6.5ZM1.5 15H5.5V14H1.5V15ZM14.8254 6.12037L7.8254 0.120372L7.1746 0.879628L14.1746 6.87963L14.8254 6.12037ZM7.1746 0.120372L0.174604 6.12037L0.825396 6.87963L7.8254 0.879628L7.1746 0.120372ZM6 14.5V11.5H5V14.5H6ZM9 11.5V14.5H10V11.5H9ZM9.5 15H13.5V14H9.5V15ZM15 13.5V6.5H14V13.5H15ZM0 6.5V13.5H1V6.5H0ZM7.5 10C8.32843 10 9 10.6716 9 11.5H10C10 10.1193 8.88071 9 7.5 9V10ZM7.5 9C6.11929 9 5 10.1193 5 11.5H6C6 10.6716 6.67157 10 7.5 10V9ZM13.5 15C14.3284 15 15 14.3284 15 13.5H14C14 13.7761 13.7761 14 13.5 14V15ZM1.5 14C1.22386 14 1 13.7761 1 13.5H0C0 14.3284 0.671573 15 1.5 15V14Z"
                      fill="#000000"
                    ></path>
                  </g>
                </svg>
                <span className="menu__list-item__text">Главная</span>
              </Link>
            </li>
            <li className="menu__list-item">
              <div
                className="menu__list-link"
                onClick={() => setOppenPostModal(true)}
              >
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                    stroke="#1C274C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                    stroke="#1C274C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <span className="menu__list-item__text">cоздать</span>
              </div>
            </li>
            <li className="menu__list-item">
              <div
                className="menu__list-link"
                onClick={() => setFriendsOpen(true)}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke-width="3"
                  stroke="#000000"
                  fill="none"
                >
                  <circle cx="29.22" cy="16.28" r="11.14" />
                  <path d="M41.32,35.69c-2.69-1.95-8.34-3.25-12.1-3.25h0A22.55,22.55,0,0,0,6.67,55h29.9" />
                  <circle cx="45.38" cy="46.92" r="11.94" />
                  <line x1="45.98" y1="39.8" x2="45.98" y2="53.8" />
                  <line x1="38.98" y1="46.8" x2="52.98" y2="46.8" />
                </svg>
                <span className="menu__list-item__text">друзья</span>
              </div>
            </li>
            <li className="menu__list-item">
              <Link
                className="menu__list-link profile"
                to={`/profile/${user.data?.id}`}
              >
                <svg
                  fill="#000000"
                  width="800px"
                  height="800px"
                  viewBox="0 0 30.586 30.586"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="translate(-546.269 -195.397)">
                    <path d="M572.138,221.245a15.738,15.738,0,0,0-21.065-.253l-1.322-1.5a17.738,17.738,0,0,1,23.741.28Z" />

                    <path d="M561.464,204.152a4.96,4.96,0,1,1-4.96,4.96,4.966,4.966,0,0,1,4.96-4.96m0-2a6.96,6.96,0,1,0,6.96,6.96,6.96,6.96,0,0,0-6.96-6.96Z" />

                    <path d="M561.562,197.4a13.293,13.293,0,1,1-13.293,13.293A13.308,13.308,0,0,1,561.562,197.4m0-2a15.293,15.293,0,1,0,15.293,15.293A15.293,15.293,0,0,0,561.562,195.4Z" />
                  </g>
                </svg>
                <span className="menu__list-item__text">профиль</span>
              </Link>
            </li>
            <li className="menu__list-item">
              <Link className="menu__list-link" to={`/chat/${user.data?.id}`}>
                <img
                  className="menu__list-item__img"
                  src="/static/media/message.ce2743d0aa415e8c0aa4ab9b2b9537f6.svg"
                  alt=""
                />
                <span className="menu__list-item__text">Сообщения</span>
              </Link>
            </li>
            <li className="menu__list-item">
              <Link className="menu__list-link" to={`/mixes`}>
                <img className="menu__list-item__img" src={mixes} alt="" />
                <span className="menu__list-item__text mixes">Mixes</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="aside__footer">
        <button className="aside__footer-btn" onClick={() => onLogout()}>
          <span className="menu__list-item__text">выйти</span>
        </button>
      </div>

      <PostModal
        oppen={oppenPostModal}
        onCancel={() => setOppenPostModal(false)}
        setOppenModal={setOppenPostModal}
      />

      <UsersModal
        isLoading={users.isLoading}
        data={users?.data}
        open={friendsOpen}
        setOpen={setFriendsOpen}
        title={"Найти друзей"}
      />
    </div>
  );
};

export default Aside;
