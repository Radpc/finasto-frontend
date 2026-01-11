import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { persistor, store } from "./storage/index.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import "./scss/_global.scss";
import { AppRouter } from "./router/index.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <AppRouter />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
