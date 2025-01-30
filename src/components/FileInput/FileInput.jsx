import React, { useState } from "react";

import "../UpdateForm/UpdateModal.scss";

const FileInput = ({
  setUrl,
  setFormData,
  name,
  label = "",
  children = null,
  width,
  setFile,
}) => {
  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    setUrl && setUrl(fileReader.result);
  };

  const handleChange = async (e) => {
    if (e.target.files) {
      const fromData = new FormData();
      const file = e.target.files[0];

      if (!file) return;

      fromData.append(name, file);
      setUrl && setUrl(fileReader.readAsDataURL(file));

      setFormData(fromData);
      setFile(file);
    }
  };

  return (
    <div style={{ width }}>
      <label className={`${label && !children ? "update__profile-label" : ""}`}>
        {label}

        <input
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleChange(e)}
        />
        {children}
      </label>
    </div>
  );
};

export default FileInput;
