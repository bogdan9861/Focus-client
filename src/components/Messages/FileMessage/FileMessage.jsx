import React, { useEffect, useRef, useState } from "react";
import AudioMessageBtn from "../AudioMessageBtn/AudioMessageBtn";

import fileIcon from "../../../assets/icons/file.svg";

import "./FileMessage.scss";

const FileMessage = ({ path, self }) => {
  const [fileName, setFileName] = useState("");
  const [extension, setExtension] = useState("");

  const serverPath = useRef(`${process.env.REACT_APP_SERVER_URL}/${path}`);

  useEffect(() => {
    let extensionArr = [];
    let extension = "";

    for (let i = path.length - 1; i > 0; i--) {
      if (path[i] !== ".") {
        extensionArr.unshift(path[i]);
      } else {
        break;
      }
    }

    extensionArr.forEach((letter) => {
      extension += letter;
    });

    setExtension(extension);
    setFileName(path.split("\\").pop());
  }, [fileName]);

  const defineTypeByExtension = () => {
    let type = "";

    switch (extension) {
      case "mp4":
      case "webm":
      case "mov":
      case "avi":
      case "flv":
        type = "video";
        break;
      case "webm":
      case "mpeg":
      case "mp3":
        type = "audio";
        break;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        type = "image";
        break;
      default:
        type = "file";
        break;
    }

    return type;
  };

  useEffect(() => {
    console.log(extension);
  }, []);

  return (
    <>
      {defineTypeByExtension() === "video" ? (
        <video
          style={{ maxWidth: "100%" }}
          src={serverPath.current}
          controls
          muted
          autoPlay
          playsInline
          loop
        />
      ) : defineTypeByExtension() === "audio" ? (
        <div className={`fileMessage ${self ? "self" : ""}`}>
          <AudioMessageBtn self={self} url={path} />
          <p>{fileName}</p>
        </div>
      ) : defineTypeByExtension() === "image" ? (
        <img src={serverPath.current} alt="" />
      ) : (
        <a
          href={serverPath.current}
          download={`${fileName}.${extension}`}
          className={`fileMessage ${self ? "self" : ""}`}
        >
          <div className="fileMessage__icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                confirmOpen
                <path
                  d="M20 7V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H12.5M18 18V12.5C18 11.6716 18.6716 11 19.5 11C20.3284 11 21 11.6716 21 12.5V18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18V14"
                  stroke="#3797f0"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                confirmOpen
              </g>
            </svg>
          </div>
          <p className="fileMessage__name">{fileName}</p>
        </a>
      )}
    </>
  );
};

export default FileMessage;
