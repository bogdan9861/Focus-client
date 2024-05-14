import { useState } from "react";
import "./Aside.scss";

import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";

const Aside = () => {
  const [oppen, setOppen] = useState("");

  window.addEventListener("mousemove", (e) => {
    if (e.clientX <= 10) {
      setOppen("oppen");
    } else if (e.clientX > 275) {
      setOppen("");
    }
  });

  return (
    <div className={`aside ${oppen}`}>
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
        <a className="aside__footer-link" href="#">
          выйти
        </a>
      </div>
    </div>
  );
};

export default Aside;
