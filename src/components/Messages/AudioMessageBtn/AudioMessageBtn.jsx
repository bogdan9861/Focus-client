import React from "react";

import "../../../pages/chat/Chat.scss";

const AudioMessageBtn = ({ url, self }) => {
  const playAudio = (e) => {
    const target = e.target;
    const audio = target.children[0];
    const isPlaying = target.className.includes("active");

    if (isPlaying) {
      audio.pause();
      target.classList.remove("active");
    } else {
      target.classList.add("active");
      audio.play();
    }
  };

  return (
    <button
      className={`chat-body__message-play ${self ? "self" : ""}`}
      onClick={(e) => playAudio(e)}
    >
      <audio
        src={`${process.env.REACT_APP_SERVER_URL}/${url}`}
        onEnded={(e) => e.target.parentElement.classList.remove("active")}
      />
      <img
        className="play"
        src={`https://img.icons8.com/?size=100&id=99cTBfGlewZU&format=png&color=${
          self ? "5088df" : "ffffff"
        }`}
        alt=""
      />
      <img
        className="pause"
        src={`https://img.icons8.com/?size=100&id=61012&format=png&color=${
          self ? "5088df" : "ffffff"
        }`}
        alt=""
      />
    </button>
  );
};

export default AudioMessageBtn;
