import React, { useEffect, useState } from "react";

import cross from "../../assets/icons/cross.svg";

import "./photoViewer.scss";

const PhotoViewer = () => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e) return;
      
      const target = e.target;

      if (target.nodeName === "IMG" && target.className.includes("viewer")) {
        setUrl(target.getAttribute("src"));
        setOpen(true);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const onZoom = (e) => {
    if (zoomed) return;

    e.target.style = "transform: scale(1.5)";
    setZoomed(true);
  };

  const onDefaultScale = (e) => {
    if (!zoomed) return;

    e.target.style = "transform: translate(0, 0) scale(1)";
    setZoomed(false);
  };

  return (
    <div className={`photoViewer ${open ? "photoViewer--active" : null}`}>
      <button className="photoViewer__close" onClick={() => setOpen(false)}>
        <img src={cross} alt="" />
      </button>
      <img
        className="photoViewer__img"
        src={url}
        alt=""
        onDoubleClick={onZoom}
        onClick={onDefaultScale}
      />
    </div>
  );
};

export default PhotoViewer;
