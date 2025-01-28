import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import PostModal from "../postModal/PostModal";
import { logout } from "../../features/auth";

import shortLogo from "../../assets/images/short-logo.svg";
import logo from "../../assets/images/logo.svg";
import home from "../../assets/icons/home.svg";
import add from "../../assets/icons/add.svg";
import profile from "../../assets/icons/profile.svg";
import friends from "../../assets/icons/friends.svg";

import "./Aside.scss";

const Aside = ({ open, noResize = null }) => {
  const [oppenPostModal, setOppenPostModal] = useState(false);

  const dispatch = useDispatch();
  const collapseWidth = useRef(1205);

  const onLogout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.reload();
  });

  const handleResize = () => {
    if (noResize) return;

    const aside = document.querySelector(".aside");

    if (document.body.clientWidth <= collapseWidth.current) {
      aside.classList.remove("aside--active");
    } else {
      aside.classList.add("aside--active");
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

  return (
    <div className={`aside ${open ? "aside--active" : ""}`}>
      <div className="logo__wrapper">
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
                <img className="menu__list-item__img" src={home} alt="" />
                <span className="menu__list-item__text">Главная</span>
              </Link>
            </li>
            <li className="menu__list-item">
              <div
                className="menu__list-link"
                onClick={() => setOppenPostModal(true)}
              >
                <img className="menu__list-item__img" src={add} alt="" />
                <span className="menu__list-item__text">cоздать</span>
              </div>
            </li>
            <li className="menu__list-item">
              <Link className="menu__list-link" to={"/"}>
                <img className="menu__list-item__img" src={friends} alt="" />
                <span className="menu__list-item__text">друзья</span>
              </Link>
            </li>
            <li className="menu__list-item">
              <Link className="menu__list-link" to={"/"}>
                <img className="menu__list-item__img" src={profile} alt="" />
                <span className="menu__list-item__text">профиль</span>
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
    </div>
  );
};

export default Aside;
