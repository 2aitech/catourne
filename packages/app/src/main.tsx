import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import { App } from "./app";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Element #root introuvable.");

createRoot(rootElement).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
