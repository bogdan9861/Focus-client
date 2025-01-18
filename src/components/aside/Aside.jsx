import { useCallback, useMemo, useState } from "react";
import "./Aside.scss";

import { logout } from "../../features/auth";
import { useDispatch } from "react-redux";

import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";

const Aside = () => {
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.reload();
  });

  return (
    <div className="aside">
      <div className="logo__wrapper">
        <img className="aside__img" src={logo} alt="" />
      </div>
      <div className="aside__inner">
        <nav className="menu">
          <ul className="menu__list">
            <li className="menu__list-item">
              <Link className="menu__list-link" to={"/"}>
                главная
              </Link>
            </li>
            <li className="menu__list-item">
              <a className="menu__list-link" href="#">
                избранное
              </a>
            </li>
            <li className="menu__list-item">
              <a className="menu__list-link" href="#">
                нравится
              </a>
            </li>
            <li className="menu__list-item">
              <a className="menu__list-link" href="#">
                настройки
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="aside__footer">
        <button className="aside__footer-btn" onClick={() => onLogout()}>
          выйти
        </button>
      </div>
    </div>
  );
};

export default Aside;
