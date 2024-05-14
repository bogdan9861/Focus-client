import { Alert } from "antd";

export const CustomError = ({ message }) => {
  if (!message) return;

  return <Alert message={message} type="error" />;
};
