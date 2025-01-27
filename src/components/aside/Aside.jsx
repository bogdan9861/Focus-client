import { useCallback, useEffect, useMemo, useState } from "react";
import "./Aside.scss";

import { logout } from "../../features/auth";
import { useDispatch } from "react-redux";

import logo from "../../assets/images/logo.svg";
import shortLogo from "../../assets/images/short-logo.svg";
import { Link } from "react-router-dom";

import { AsideNavigation } from "../../AsideNavigation/AsideNavigation";

const Aside = ({ open }) => {
  const dispatch = useDispatch();
  const [collapseWidth, setCollapseWidth] = useState(1205);

  const onLogout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.reload();
  });

  const handleResize = () => {
    const aside = document.querySelector(".aside");

    if (document.body.clientWidth <= collapseWidth) {
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
        <picture>
          <source
            srcSet={shortLogo}
            media={`(max-width: ${collapseWidth}px`}
            style={{
              width: "10px",
              height: "10px",
              display: "block",
            }}
          />
          <img src={logo} alt="" />
        </picture>
      </div>
      <div className="aside__inner">
        <nav className="menu">
          <ul className="menu__list">
            {AsideNavigation.map((item) => (
              <li className="menu__list-item">
                <Link className="menu__list-link" to={item.link}>
                  <img
                    className="menu__list-item__img"
                    src={item.image}
                    alt=""
                  />
                  <span className="menu__list-item__text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="aside__footer">
        <button className="aside__footer-btn" onClick={() => onLogout()}>
          <span className="menu__list-item__text">выйти</span>
        </button>
      </div>
    </div>
  );
};

export default Aside;
