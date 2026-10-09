import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./i18n/i18n";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(
<React.StrictMode> <App />
</React.StrictMode>
);
