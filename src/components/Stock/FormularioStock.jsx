// src/components/Stock/FormularioStock.jsx
import React, { useState, useEffect } from "react";
import "./FormularioStock.css";

const FormularioStock = ({ producto, onGuardar, onCancelar, loading }) => {
  const [nuevoStock, setNuevoStock] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (producto) {
      setNuevoStock(producto.stock || 0);
    }
  }, [producto]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const stockNum = parseInt(nuevoStock);
    if (isNaN(stockNum) || stockNum < 0) {
      setError("El stock debe ser un número mayor o igual a 0");
      return;
    }

    onGuardar({ stock: stockNum });
  };

  return (
    <div className="formulario-overlay" onClick={onCancelar}>
      <div className="formulario-modal" onClick={(e) => e.stopPropagation()}>
        <h3>📊 Ajustar Stock</h3>

        {producto && (
          <div className="stock-producto-info">
            <p className="stock-producto-nombre">{producto.nombre}</p>
            <p className="stock-producto-actual">
              Stock actual: <strong>{producto.stock || 0}</strong>
            </p>
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-campo">
            <label>Nuevo stock *</label>
            <input
              type="number"
              name="stock"
              value={nuevoStock}
              onChange={(e) => {
                setNuevoStock(e.target.value);
                if (error) setError("");
              }}
              placeholder="0"
              min="0"
              step="1"
              autoFocus
              disabled={loading}
            />
            <small className="form-help">
              Ingresá el stock físico contado. Reemplaza el valor actual.
            </small>
          </div>

          <div className="form-acciones">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onCancelar}
              disabled={loading}
            >
              ❌ Cancelar
            </button>
            <button type="submit" className="btn-guardar" disabled={loading}>
              {loading ? "⏳ Guardando..." : "💾 Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioStock;
