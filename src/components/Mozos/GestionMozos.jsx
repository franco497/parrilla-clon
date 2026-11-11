// src/components/Mozos/GestionMozos.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useRestaurante } from "../../context/RestauranteContext";
import FormularioMozo from "./FormularioMozo";
import SelectCustom from "../Stock/SelectCustom";
import Pagination from "../Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useOrientation } from "../../hooks/useOrientation";
import Swal from "sweetalert2";

const GestionMozos = ({ onVolver }) => {
  useOrientation();

  const { mozos, crearMozo, actualizarMozo, eliminarMozo, restaurarMozo } =
    useRestaurante();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [mozoEditando, setMozoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const mozosFiltrados = useMemo(() => {
    let filtrados = [...mozos];

    if (filtroEstado === "activos") {
      filtrados = filtrados.filter((m) => m.activo !== false);
    } else if (filtroEstado === "inactivos") {
      filtrados = filtrados.filter((m) => m.activo === false);
    }

    if (busqueda.trim()) {
      const term = busqueda.toLowerCase().trim();
      filtrados = filtrados.filter((m) =>
        m.nombre.toLowerCase().includes(term),
      );
    }

    return filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [mozos, busqueda, filtroEstado]);

  // ==========================================
  // PAGINACIÓN
  // ==========================================
  const breakpoint = useBreakpoint();
  const itemsPerPage = breakpoint === "mobile" ? 6 : 10;

  const { currentPage, totalPages, paginatedItems, setCurrentPage } =
    usePagination(mozosFiltrados, { itemsPerPage });

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroEstado]);

  const handleNuevoMozo = () => {
    setMozoEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarMozo = (mozo) => {
    setMozoEditando(mozo);
    setMostrarFormulario(true);
  };

  const handleEliminarMozo = async (mozo) => {
    const result = await Swal.fire({
      title: "¿Eliminar mozo?",
      html: `¿Eliminar al mozo <strong>"${mozo.nombre}"</strong>?<br><br>Se marcará como inactivo y podrá restaurarse después.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c62828",
      cancelButtonColor: "#444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    const resultDelete = await eliminarMozo(mozo.id_mozo);
    if (resultDelete.success) {
      setMensaje(`✅ "${mozo.nombre}" eliminado`);
      setTimeout(() => setMensaje(""), 2500);
    } else {
      setMensaje(`❌ Error: ${resultDelete.error}`);
    }
    setLoading(false);
  };

  const handleRestaurarMozo = async (mozo) => {
    const result = await Swal.fire({
      title: "¿Restaurar mozo?",
      html: `¿Restaurar al mozo <strong>"${mozo.nombre}"</strong>?<br><br>Volverá a estar activo.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2d6a4f",
      cancelButtonColor: "#444",
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    const resultRestore = await restaurarMozo(mozo.id_mozo);
    if (resultRestore.success) {
      setMensaje(`✅ "${mozo.nombre}" restaurado`);
      setTimeout(() => setMensaje(""), 2500);
    } else {
      setMensaje(`❌ Error: ${resultRestore.error}`);
    }
    setLoading(false);
  };

  const handleGuardar = async (datos) => {
    setLoading(true);
    let result;

    if (mozoEditando) {
      result = await actualizarMozo(mozoEditando.id_mozo, datos);
    } else {
      result = await crearMozo(datos);
    }

    if (result.success) {
      setMensaje(mozoEditando ? "✅ Mozo actualizado" : "✅ Mozo creado");
      setTimeout(() => setMensaje(""), 2500);
      setMostrarFormulario(false);
      setMozoEditando(null);
    } else {
      setMensaje(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setMozoEditando(null);
  };

  return (
    <div className="gestion-mozos">
      {/* Header (compartido con gestion-comun.css) */}
      <div className="gestion-header">
        <button className="btn-volver" onClick={onVolver}>
          ⬅ Volver al Menú
        </button>
        <h2>👨‍🍳 Gestión de Mozos</h2>
        <button
          className="gestion-mozos__btn-nuevo"
          onClick={handleNuevoMozo}
          disabled={loading}
        >
          ➕ Nuevo Mozo
        </button>
      </div>

      {/* Mensaje (compartido) */}
      {mensaje && (
        <div
          className={`mensaje ${mensaje.includes("❌") ? "error" : "success"}`}
        >
          {mensaje}
        </div>
      )}

      {/* Filtros (compartido) */}
      <div className="gestion-filtros">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />

        <SelectCustom
          value={filtroEstado}
          onChange={setFiltroEstado}
          placeholder="Activos"
          options={[
            { value: "activos", label: "✅ Activos" },
            { value: "inactivos", label: "❌ Inactivos" },
            { value: "todos", label: "📋 Todos" },
          ]}
        />
      </div>

      {/* Contador (compartido) */}
      <div className="gestion-contador">
        Mostrando {paginatedItems.length} de {mozosFiltrados.length} mozos
        filtrados (total: {mozos.length})
      </div>

      {/* Tabla (específica) */}
      <div className="gestion-mozos__tabla-wrapper">
        {paginatedItems.length === 0 ? (
          <p className="sin-mozos">
            {busqueda
              ? "No se encontraron mozos con ese filtro"
              : "No hay mozos para mostrar"}
          </p>
        ) : (
          <table className="gestion-mozos__tabla">
            <thead>
              <tr className="gestion-mozos__fila-header">
                <th>Nombre</th>
                <th className="gestion-mozos__col-estado">Estado</th>
                <th className="gestion-mozos__col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((mozo) => (
                <tr
                  key={mozo.id_mozo}
                  className={
                    mozo.activo === false ? "gestion-mozos__fila-inactiva" : ""
                  }
                >
                  <td className="gestion-mozos__col-nombre" data-label="Nombre">
                    {mozo.nombre}
                  </td>
                  <td className="gestion-mozos__col-estado" data-label="Estado">
                    {mozo.activo === false ? (
                      <span className="gestion-mozos__badge-inactivo">
                        ❌ Inactivo
                      </span>
                    ) : (
                      <span className="gestion-mozos__badge-activo">
                        ✅ Activo
                      </span>
                    )}
                  </td>
                  <td
                    className="gestion-mozos__col-acciones"
                    data-label="Acciones"
                  >
                    <button
                      className="gestion-mozos__btn-editar"
                      onClick={() => handleEditarMozo(mozo)}
                      disabled={loading || mozo.activo === false}
                      title="Editar"
                    >
                      Editar
                    </button>
                    {mozo.activo === false ? (
                      <button
                        className="gestion-mozos__btn-restaurar"
                        onClick={() => handleRestaurarMozo(mozo)}
                        disabled={loading}
                        title="Restaurar"
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        className="gestion-mozos__btn-eliminar"
                        onClick={() => handleEliminarMozo(mozo)}
                        disabled={loading}
                        title="Eliminar"
                      >
                        Borrar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {mostrarFormulario && (
        <FormularioMozo
          mozo={mozoEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelarFormulario}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GestionMozos;
