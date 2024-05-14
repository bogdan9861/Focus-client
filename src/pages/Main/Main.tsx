import { useEffect } from "react";
import Aside from "../../components/aside/Aside";
import Feed from "../../components/feed/Feed";
import Header from "../../components/header/Header";

import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Header />
      <Feed />
      <Aside />
    </>
  );
}

export default Main;
