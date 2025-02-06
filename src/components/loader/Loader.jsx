import React from "react";
import "./Loader.scss";

const Loader = ({ height }) => {
  return (
    <div className="loader__wrapper" style={{ height }}>
      <div class="loading"></div>
    </div>
  );
};

export default Loader;
