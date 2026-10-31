import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// ============================================
// ITCSS ATÓMICO - Imports en orden
// ============================================

// Base: reset, variables, tipografía, layout
import "./styles/base/reset.css";
import "./styles/base/variables.css";
import "./styles/base/typography.css";
import "./styles/base/breakpoints.css";
import "./styles/base/headings.css";
import "./styles/base/container.css";

// Components: genéricos compartidos + componentes específicos
import "./styles/components/buttons.css";
import "./styles/components/badges.css";
import "./styles/components/modal.css";
import "./styles/components/table.css";
import "./styles/components/card.css";
import "./styles/components/navbar.css";
import "./styles/components/menu-principal.css";
import "./styles/components/select-custom.css";
import "./styles/components/mesa-card.css";
import "./styles/components/grilla-mesas.css";
import "./styles/components/selector-mozo.css";
import "./styles/components/formulario-reserva-simple.css";
import "./styles/components/formulario-stock.css";

// Pages: estilos específicos de cada pantalla
import "./styles/pages/dashboard.css";
import "./styles/pages/mesa-view.css";
import "./styles/pages/login.css";
import "./styles/pages/auth-callback.css";
import "./styles/pages/gestion-comun.css";
import "./styles/pages/gestion-mozos.css";
import "./styles/pages/gestion-productos.css";
import "./styles/pages/gestion-stock.css";

// Utilities: helpers (siempre al final)
import "./styles/utilities/animations.css";
import "./styles/utilities/spacing.css";

// ============================================
// App
// ============================================
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
