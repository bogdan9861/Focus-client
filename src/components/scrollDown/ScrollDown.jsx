import React, { useEffect } from "react";

import "./ScrollDown.scss";

const ScrollDown = ({ scroll, scrollDown }) => {
  const handleClick = () => {
    scrollDown();
  };

  return (
    <button
      onClick={handleClick}
      className={`scrollDown ${
        scroll.current + 500 < scroll.max ? "show" : "hide"
      }`}
    >
      <img
        src="https://img.icons8.com/?size=100&id=40217&format=png&color=999999"
        alt=""
      />
    </button>
  );
};

export default ScrollDown;
