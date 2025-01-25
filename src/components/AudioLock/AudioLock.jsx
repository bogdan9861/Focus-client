import React, { useEffect, useState } from "react";

import "./AudioLock.scss";
import { useSelector } from "react-redux";

const AudioLock = () => {
  const started = useSelector((state) => state.audioLock.started);
  const passed = useSelector((state) => state.audioLock.passedDistance);
  const gapToLock = useSelector((state) => state.audioLock.gapToLock);
  const locked = useSelector((state) => state.audioLock.locked);

  const [heigth, setHeight] = useState(0);

  useEffect(() => {
    setHeight((passed / gapToLock) * 100);
  }, [passed]);

  useEffect(() => {
    console.log(heigth);
  }, [heigth]);

  return (
    <div
      className={`audioLock ${started ? "audioLock--active" : ""} ${
        locked ? "audioLock--locked" : ""
      }`}
    >
      <div
        className="audioLock__inner"
        style={{
          height: `${130 - heigth}%`,
          background: locked ? "rgba(208, 78, 78, 0.9)" : null,
        }}
      >
        {!locked ? (
          <img
            className="audioLock__inner-img"
            src="https://img.icons8.com/?size=100&id=T78mDH2nJkOw&format=png&color=aaaaaa"
            alt=""
          />
        ) : (
          <img
            className="audioLock__inner-img"
            src=" https://img.icons8.com/?size=100&id=7Sm4QkMSvsON&format=png&color=ffffff"
            alt=""
          />
        )}

        <img
          style={{ opacity: `${1 - heigth / 100}` }}
          className="audioLock__inner-img"
          src="https://img.icons8.com/?size=100&id=15813&format=png&color=7a7a7a"
          alt=""
        />
      </div>
    </div>
  );
};

export default AudioLock;
