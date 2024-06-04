import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Provider from "./providers/Provider.tsx";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./context/theme/ThemeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Provider>
          <App />
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
