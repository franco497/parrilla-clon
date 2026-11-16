// src/pages/login.jsx
import { useState } from "react";
import { useOrientation } from "../hooks/useOrientation";

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useOrientation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/.netlify/functions/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el enlace");
      }

      setMessage(`✨ ¡Magic link enviado a ${email}! Revisa tu correo.`);
      setEmail("");
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al enviar el magic link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Inicia Sesion con Magic Link, solo ingresa tu E-mail:</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="login-input"
          />
        </div>

        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Enviando..." : "Enviar Magic Link"}
        </button>

        {message && <div className="login-message success">{message}</div>}
        {error && <div className="login-message error">❌ {error}</div>}
      </form>
    </div>
  );
}

export default Login;