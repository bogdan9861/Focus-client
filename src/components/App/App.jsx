import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useCurrentUserQuery } from "../../app/service/user";

import Main from "../../pages/Main/Main";
import Profile from "../../pages/Profile/Profile";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import Chat from "../../pages/chat/Chat";
import Conference from "../../pages/Сonference/Сonference";
import CallOfferModal from "../CallOfferModal/CallOfferModal";

import { socket } from "../../socket";

const App = () => {
  const user = useCurrentUserQuery();

  useEffect(() => {
    if (!user.isLoading && user.data) {
      socket.emit("auth", user.data.id);
    }
  }, [user.isLoading]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Main} />
          <Route path="/profile/:id" Component={Profile} />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/chat/:id" Component={Chat} />
          <Route path="/conference/:id" Component={Conference} />
        </Routes>

        <CallOfferModal />
      </Router>
    </>
  );
};

export default App;
