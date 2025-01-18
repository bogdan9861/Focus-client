import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import {
  createBrowserRouter,
  RouterProvider as Router,
} from "react-router-dom";
import Main from "./pages/Main/Main";

import "./assets/styles/reset.scss";
import "./assets/styles/index.css";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Chat from "./pages/chat/Chat";

import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/chat/:id",
    element: <Chat />,
  },
]);

root.render(
  <Provider store={store}>
    <Router router={router} />
  </Provider>
);
