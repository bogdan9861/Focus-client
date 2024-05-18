import React, { useState } from "react";
import "../UpdateForm/UpdateModal.scss";

type Props = {
  setUrl: (str) => void;
};

const FileInput = ({ setUrl }: Props) => {
  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    setUrl(fileReader.result);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (!file) return;

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <>
      <label className="update__profile-label">
        Выберите фото
        <input
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleChange(e)}
        />
      </label>
    </>
  );
};

export default FileInput;
