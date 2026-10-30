import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// ITCSS — orden: settings → tools → generic → elements → objects → components → utilities
import "./styles/01-settings/_colors.css";
import "./styles/01-settings/_typography.css";
import "./styles/01-settings/_breakpoints.css";
import "./styles/02-tools/_animations.css";
import "./styles/03-generic/_reset.css";
import "./styles/04-elements/_headings.css";
import "./styles/05-objects/_container.css";
import "./styles/06-components/_buttons.css";
import "./styles/06-components/_badges.css";
import "./styles/06-components/_modal.css";
import "./styles/06-components/_table.css";
import "./styles/06-components/_card.css";
import "./styles/06-components/_gestion.css";
import "./styles/06-components/_dashboard.css"; // ← NUEVO
import "./styles/06-components/_grilla-mesas.css"; // ← NUEVO
import "./styles/06-components/_mesa-card.css"; // ← NUEVO
import "./styles/07-utilities/_spacing.css";
import "./styles/06-components/_menu-principal.css";
import "./styles/06-components/_select-custom.css";
import "./styles/06-components/_mesa-view.css";
import "./styles/06-components/_formulario-reserva-simple.css";
import "./styles/06-components/_selector-mozo.css";
import "./styles/06-components/_login.css";
import "./styles/06-components/_auth-callback.css";
import "./styles/06-components/_navbar.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
