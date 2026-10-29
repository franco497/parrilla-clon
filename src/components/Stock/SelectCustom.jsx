// src/components/Stock/SelectCustom.jsx
import React, { useState, useRef, useEffect } from "react";

const SelectCustom = ({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
}) => {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const opcionSeleccionada = options.find((o) => o.value === value);

  const handleSeleccionar = (opcionValue) => {
    onChange(opcionValue);
    setAbierto(false);
  };

  return (
    <div className="select-custom" ref={ref}>
      <button
        type="button"
        className="select-custom-trigger"
        onClick={() => setAbierto(!abierto)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
      >
        <span className="select-custom-value">
          {opcionSeleccionada?.label || placeholder}
        </span>
        <span className={`select-custom-arrow ${abierto ? "abierto" : ""}`}>
          ▼
        </span>
      </button>

      {abierto && (
        <ul className="select-custom-options" role="listbox">
          {options.map((opcion) => (
            <li
              key={opcion.value}
              role="option"
              aria-selected={opcion.value === value}
              className={`select-custom-option ${
                opcion.value === value ? "seleccionada" : ""
              }`}
              onClick={() => handleSeleccionar(opcion.value)}
            >
              {opcion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectCustom;
