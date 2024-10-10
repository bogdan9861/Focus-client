import React, { useState } from "react";
import "../UpdateForm/UpdateModal.scss";
import { useUploadMutation } from "../../app/service/file";

type Props = {
  setUrl: (str) => void;
  setFormData: (data) => void;
  setFile?: (file) => void;
  name: string;
};

const FileInput = ({ setUrl, setFormData, setFile, name }: Props) => {
  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    setUrl(fileReader.result);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fromData = new FormData();
      const file = e.target.files[0];

      if (!file) return;

      fromData.append(name, file);
      setUrl(fileReader.readAsDataURL(file));
      setFormData(fromData);
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
