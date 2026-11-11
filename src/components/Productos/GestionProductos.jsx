// src/components/Productos/GestionProductos.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useRestaurante } from "../../context/RestauranteContext";
import FormularioProducto from "./FormularioProducto";
import SelectCustom from "../Stock/SelectCustom";
import Pagination from "../Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useOrientation } from "../../hooks/useOrientation";
import Swal from "sweetalert2";

const GestionProductos = ({ onVolver }) => {
  useOrientation();

  const {
    productos,
    categorias,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    restaurarProducto,
  } = useRestaurante();

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activos");
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const productosFiltrados = useMemo(() => {
    let filtrados = [...productos];

    if (filtroEstado === "activos") {
      filtrados = filtrados.filter((p) => p.activo !== false);
    } else if (filtroEstado === "inactivos") {
      filtrados = filtrados.filter((p) => p.activo === false);
    }

    if (filtroCategoria) {
      filtrados = filtrados.filter(
        (p) => p.id_categoria === parseInt(filtroCategoria),
      );
    }

    if (busqueda.trim()) {
      const term = busqueda.toLowerCase().trim();
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(term),
      );
    }

    return filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [productos, busqueda, filtroCategoria, filtroEstado]);

  // ==========================================
  // PAGINACIÓN
  // ==========================================
  const breakpoint = useBreakpoint();
  const itemsPerPage = breakpoint === "mobile" ? 6 : 10;

  const { currentPage, totalPages, paginatedItems, setCurrentPage } =
    usePagination(productosFiltrados, { itemsPerPage });

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroCategoria, filtroEstado]);

  const getNombreCategoria = (idCategoria) => {
    const cat = categorias.find((c) => c.id_categoria === idCategoria);
    return cat?.nombre || "Sin categoría";
  };

  const handleNuevoProducto = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleEliminarProducto = async (producto) => {
    // ✅ SweetAlert2 en lugar de window.confirm
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      html: `¿Eliminar el producto <strong>"${producto.nombre}"</strong>?<br><br>Se marcará como inactivo y podrá restaurarse después.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c62828",
      cancelButtonColor: "#444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    const resultDelete = await eliminarProducto(producto.id_producto);
    if (resultDelete.success) {
      setMensaje(`✅ "${producto.nombre}" eliminado`);
      setTimeout(() => setMensaje(""), 2500);
    } else {
      setMensaje(`❌ Error: ${resultDelete.error}`);
    }
    setLoading(false);
  };

  const handleRestaurarProducto = async (producto) => {
    const result = await Swal.fire({
      title: "¿Restaurar producto?",
      html: `¿Restaurar el producto <strong>"${producto.nombre}"</strong>?<br><br>Volverá a estar activo.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2d6a4f",
      cancelButtonColor: "#444",
      confirmButtonText: "Sí, restaurar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    const resultRestore = await restaurarProducto(producto.id_producto);
    if (resultRestore.success) {
      setMensaje(`✅ "${producto.nombre}" restaurado`);
      setTimeout(() => setMensaje(""), 2500);
    } else {
      setMensaje(`❌ Error: ${resultRestore.error}`);
    }
    setLoading(false);
  };

  const handleGuardar = async (datos) => {
    setLoading(true);
    let result;

    if (productoEditando) {
      result = await actualizarProducto(productoEditando.id_producto, datos);
    } else {
      result = await crearProducto(datos);
    }

    if (result.success) {
      setMensaje(
        productoEditando ? "✅ Producto actualizado" : "✅ Producto creado",
      );
      setTimeout(() => setMensaje(""), 2500);
      setMostrarFormulario(false);
      setProductoEditando(null);
    } else {
      setMensaje(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  return (
    <div className="gestion-productos">
      {/* Header (compartido con gestion-comun.css) */}
      <div className="gestion-header">
        <button className="btn-volver" onClick={onVolver}>
          ⬅ Volver al Menú
        </button>
        <h2>📦 Gestión de Productos</h2>
        <button
          className="gestion-productos__btn-nuevo"
          onClick={handleNuevoProducto}
          disabled={loading}
        >
          ➕ Nuevo Producto
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
          value={filtroCategoria}
          onChange={setFiltroCategoria}
          placeholder="Todas las categorías"
          options={[
            { value: "", label: "Todas las categorías" },
            ...categorias.map((cat) => ({
              value: String(cat.id_categoria),
              label: cat.nombre,
            })),
          ]}
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
        Mostrando {paginatedItems.length} de {productosFiltrados.length}{" "}
        productos filtrados (total: {productos.length})
      </div>

      {/* Tabla (específica) */}
      <div className="gestion-productos__tabla-wrapper">
        {paginatedItems.length === 0 ? (
          <p className="sin-productos">
            {busqueda || filtroCategoria
              ? "No se encontraron productos con esos filtros"
              : "No hay productos para mostrar"}
          </p>
        ) : (
          <table className="gestion-productos__tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th className="gestion-productos__col-precio">Precio</th>
                <th className="gestion-productos__col-estado">Estado</th>
                <th className="gestion-productos__col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((producto) => (
                <tr
                  key={producto.id_producto}
                  className={
                    producto.activo === false
                      ? "gestion-productos__fila-inactiva"
                      : ""
                  }
                >
                  <td
                    className="gestion-productos__col-nombre"
                    data-label="Producto"
                  >
                    {producto.nombre}
                  </td>
                  <td data-label="Categoría">
                    {getNombreCategoria(producto.id_categoria)}
                  </td>
                  <td
                    className="gestion-productos__col-precio"
                    data-label="Precio"
                  >
                    ${parseFloat(producto.precio).toLocaleString("es-AR")}
                  </td>
                  <td
                    className="gestion-productos__col-estado"
                    data-label="Estado"
                  >
                    {producto.activo === false ? (
                      <span className="gestion-productos__badge-inactivo">
                        ❌ Inactivo
                      </span>
                    ) : (
                      <span className="gestion-productos__badge-activo">
                        ✅ Activo
                      </span>
                    )}
                  </td>
                  <td
                    className="gestion-productos__col-acciones"
                    data-label="Acciones"
                  >
                    <button
                      className="gestion-productos__btn-editar"
                      onClick={() => handleEditarProducto(producto)}
                      disabled={loading || producto.activo === false}
                      title="Editar"
                    >
                      Editar
                    </button>
                    {producto.activo === false ? (
                      <button
                        className="gestion-productos__btn-restaurar"
                        onClick={() => handleRestaurarProducto(producto)}
                        disabled={loading}
                        title="Restaurar"
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        className="gestion-productos__btn-eliminar"
                        onClick={() => handleEliminarProducto(producto)}
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
        <FormularioProducto
          producto={productoEditando}
          categorias={categorias}
          onGuardar={handleGuardar}
          onCancelar={handleCancelarFormulario}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GestionProductos;
