// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRestaurante } from "../context/RestauranteContext";
import MenuPrincipal from "../components/MenuPrincipal/MenuPrincipal";
import GrillaMesas from "../components/Mesas/GrillaMesas";
import Navbar from "../components/Navbar";
import GestionProductos from "../components/Productos/GestionProductos";
import GestionMozos from "../components/Mozos/GestionMozos";
import GestionStock from "../components/Stock/GestionStock";

const Dashboard = () => {
  const { loading, productos } = useRestaurante();
  const location = useLocation();
  const [vistaActual, setVistaActual] = useState("principal");

  useEffect(() => {
    if (location.state?.mostrarMesas) {
      setVistaActual("mesas");
    }
  }, [location]);

  const handleSeleccionarModulo = (moduloId) => {
    setVistaActual(moduloId);
  };

  const handleVolverMenu = () => {
    setVistaActual("principal");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando sistema...</h2>
      </div>
    );
  }

  const productosBajoStock = productos.filter(
    (p) => p.activo !== false && (p.stock || 0) <= (p.stock_minimo || 5),
  ).length;

  return (
    <>
      <Navbar /> {/* ← CAMBIAR */}
      <div className="dashboard-container">
        {vistaActual === "principal" && (
          <MenuPrincipal
            onSeleccionarModulo={handleSeleccionarModulo}
            alertaStock={productosBajoStock}
          />
        )}

        {vistaActual === "mesas" && <GrillaMesas onVolver={handleVolverMenu} />}

        {vistaActual === "cargar" && (
          <GestionProductos onVolver={handleVolverMenu} />
        )}

        {vistaActual === "stock" && (
          <GestionStock onVolver={handleVolverMenu} />
        )}
        {vistaActual === "mozos" && (
          <GestionMozos onVolver={handleVolverMenu} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
