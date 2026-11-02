// src/main.jsx o src/index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { loadSessionThunk } from "@/actions/authThunks"; // <-- importa esto

import "./index.css";
import "./styles/theme.css";
import "./styles/public.css";
import "./styles/records.css";
import App from "./App.jsx";

// Rehidrata auth desde localStorage (sincrónico y muy rápido)
store.dispatch(loadSessionThunk());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
