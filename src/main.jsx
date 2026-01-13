import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./components/popup/Popup";
import { StrictMode } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
