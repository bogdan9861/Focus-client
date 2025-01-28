import { useEffect, useState } from "react";
import Aside from "../../components/aside/Aside";
import Feed from "../../components/feed/Feed";
import Header from "../../components/header/Header";

import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const [asideVisable, setAsideVisable] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Aside
        open={true}
        visable={asideVisable}
        setAsideVisable={setAsideVisable}
      />
      <Header setAsideVisable={setAsideVisable} />
      <Feed />
    </>
  );
}

export default Main;
