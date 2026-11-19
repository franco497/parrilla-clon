// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // ✅ SweetAlert de confirmación
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que quieres cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e76f51",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      color: "#1a1a2e",
      iconColor: "#e9c46a",
    });

    if (!result.isConfirmed) return;

    try {
      await supabase.auth.signOut();

      // ✅ SweetAlert de éxito
      await Swal.fire({
        title: "✅ Sesión cerrada",
        text: "Has cerrado sesión correctamente.",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#ffffff",
        color: "#1a1a2e",
        iconColor: "#2d6a4f",
      });

      navigate("/");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);

      // ✅ SweetAlert de error
      await Swal.fire({
        title: "❌ Error",
        text: "No se pudo cerrar la sesión. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#e76f51",
        confirmButtonText: "Entendido",
        background: "#ffffff",
        color: "#1a1a2e",
        iconColor: "#e76f51",
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Título */}
        <div className="navbar-brand">
          <span className="navbar-brand-icon">🍖</span>
          <span className="navbar-brand-text">Administracion Parrilla</span>
        </div>

        {/* Botón cerrar sesión */}
        <button
          className="navbar-logout-btn"
          onClick={handleLogout}
          title="Cerrar Sesión"
        >
          <span className="navbar-logout-icon">🚪</span>
          <span className="navbar-logout-text">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;