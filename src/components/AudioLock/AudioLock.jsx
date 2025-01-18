import React from "react";

import "./AudioLock.scss";
import { useSelector } from "react-redux";

const AudioLock = () => {
  const started = useSelector((state) => state.audioLock.started);
  const posY = useSelector((state) => state.audioLock.posY);

  return (
    <div className={`audioLock ${started ? "audioLock--active" : ""}`}>
      <div className="audioLock__inner">
        <img
          className="audioLock__inner-img"
          src="https://img.icons8.com/?size=100&id=T78mDH2nJkOw&format=png&color=aaaaaa"
          alt=""
        />

        <img
          className="audioLock__inner-img"
          src="https://img.icons8.com/?size=100&id=15813&format=png&color=7a7a7a"
          alt=""
        />
      </div>
    </div>
  );
};

export default AudioLock;
