// Forward invite/recovery links that land on another path to the password form.
if (typeof window !== "undefined" && /type=(invite|recovery)/.test(window.location.hash) && window.location.pathname !== "/set-password") {
  window.history.replaceState(null, "", "/set-password" + window.location.hash);
}
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
