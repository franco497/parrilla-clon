// src/components/Stock/GestionStock.jsx
import React, { useState, useMemo } from "react";
import { useRestaurante } from "../../context/RestauranteContext";
import FormularioStock from "./FormularioStock";
import SelectCustom from "./SelectCustom";

const GestionStock = ({ onVolver }) => {
  const { productos, categorias, ajustarStock } = useRestaurante();

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const productosFiltrados = useMemo(() => {
    let filtrados = productos.filter((p) => p.activo !== false);

    if (filtroCategoria) {
      filtrados = filtrados.filter(
        (p) => p.id_categoria === parseInt(filtroCategoria),
      );
    }

    if (filtroEstado === "con-stock") {
      filtrados = filtrados.filter(
        (p) => (p.stock || 0) > (p.stock_minimo || 5),
      );
    } else if (filtroEstado === "bajo-stock") {
      filtrados = filtrados.filter(
        (p) => (p.stock || 0) > 0 && (p.stock || 0) <= (p.stock_minimo || 5),
      );
    } else if (filtroEstado === "agotados") {
      filtrados = filtrados.filter((p) => (p.stock || 0) === 0);
    }

    if (busqueda.trim()) {
      const term = busqueda.toLowerCase().trim();
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(term),
      );
    }

    return filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [productos, busqueda, filtroCategoria, filtroEstado]);

  const getNombreCategoria = (idCategoria) => {
    const cat = categorias.find((c) => c.id_categoria === idCategoria);
    return cat?.nombre || "Sin categoría";
  };

  const getEstadoStock = (producto) => {
    const stock = producto.stock || 0;
    const minimo = producto.stock_minimo || 5;

    if (stock === 0) return { clase: "agotado", texto: "❌ Agotado" };
    if (stock <= minimo) return { clase: "bajo", texto: "⚠️ Bajo stock" };
    return { clase: "ok", texto: "✅ Con stock" };
  };

  const handleAjustar = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const handleGuardar = async (datos) => {
    setLoading(true);
    const result = await ajustarStock(
      productoEditando.id_producto,
      datos.stock,
    );

    if (result.success) {
      setMensaje(
        `✅ Stock de "${productoEditando.nombre}" ajustado a ${datos.stock}`,
      );
      setTimeout(() => setMensaje(""), 2500);
      setMostrarFormulario(false);
      setProductoEditando(null);
    } else {
      setMensaje(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  const contadores = useMemo(() => {
    const activos = productos.filter((p) => p.activo !== false);
    return {
      total: activos.length,
      agotados: activos.filter((p) => (p.stock || 0) === 0).length,
      bajoStock: activos.filter(
        (p) => (p.stock || 0) > 0 && (p.stock || 0) <= (p.stock_minimo || 5),
      ).length,
    };
  }, [productos]);

  return (
    <div className="gestion-stock">
      {/* Header (compartido con gestion-comun.css) */}
      <div className="gestion-header">
        <button className="btn-volver" onClick={onVolver}>
          ⬅ Volver al Menú
        </button>
        <h2>📊 Control de Stock</h2>
        <div className="gestion-stock__stock-resumen">
          {contadores.agotados > 0 && (
            <span className="gestion-stock__badge-resumen gestion-stock__badge-resumen--agotado">
              {contadores.agotados} agotados
            </span>
          )}
          {contadores.bajoStock > 0 && (
            <span className="gestion-stock__badge-resumen gestion-stock__badge-resumen--bajo">
              {contadores.bajoStock} bajo stock
            </span>
          )}
          <span className="gestion-stock__badge-resumen gestion-stock__badge-resumen--ok">
            {contadores.total} productos
          </span>
        </div>
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
          placeholder="Todos"
          options={[
            { value: "todos", label: "📋 Todos" },
            { value: "con-stock", label: "✅ Con stock" },
            { value: "bajo-stock", label: "⚠️ Bajo stock" },
            { value: "agotados", label: "❌ Agotados" },
          ]}
        />
      </div>

      {/* Contador (compartido) */}
      <div className="gestion-contador">
        Mostrando {productosFiltrados.length} de {contadores.total} productos
      </div>

      {/* Tabla (específica) */}
      <div className="gestion-stock__tabla-wrapper">
        {productosFiltrados.length === 0 ? (
          <p className="sin-productos">
            {busqueda || filtroCategoria || filtroEstado !== "todos"
              ? "No se encontraron productos con esos filtros"
              : "No hay productos para mostrar"}
          </p>
        ) : (
          <table className="gestion-stock__tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="gestion-stock__col-stock">Stock</th>
                <th className="gestion-stock__col-stock-min">Mín.</th>
                <th className="gestion-stock__col-estado">Estado</th>
                <th className="gestion-stock__col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                const estado = getEstadoStock(producto);
                return (
                  <tr key={producto.id_producto}>
                    <td
                      className="gestion-stock__col-nombre"
                      data-label="Producto"
                    >
                      {producto.nombre}
                    </td>
                    <td data-label="Categoría">
                      {getNombreCategoria(producto.id_categoria)}
                    </td>
                    <td
                      className={`gestion-stock__col-stock gestion-stock__stock--${estado.clase}`}
                      data-label="Stock"
                    >
                      {producto.stock || 0}
                    </td>
                    <td
                      className="gestion-stock__col-stock-min"
                      data-label="Mínimo"
                    >
                      {producto.stock_minimo || 5}
                    </td>
                    <td
                      className="gestion-stock__col-estado"
                      data-label="Estado"
                    >
                      <span
                        className={`gestion-stock__badge--${estado.clase}`}
                      >
                        {estado.texto}
                      </span>
                    </td>
                    <td
                      className="gestion-stock__col-acciones"
                      data-label="Acciones"
                    >
                      <button
                        className="gestion-stock__btn-ajustar"
                        onClick={() => handleAjustar(producto)}
                        disabled={loading}
                      >
                        Ajustar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {mostrarFormulario && (
        <FormularioStock
          producto={productoEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GestionStock;