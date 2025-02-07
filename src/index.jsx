import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store/store";

import App from "./components/App/App";

import "./assets/styles/reset.scss";
import "./assets/styles/index.css";

import "./index.css";
import { useEffect } from "react";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
