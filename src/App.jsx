// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Login from "./pages/login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { RestauranteProvider } from "./context/RestauranteContext";

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = localStorage.getItem("supabaseSession");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);

            // ✅ CLAVE: Restaurar la sesión en el cliente de Supabase
            const { data, error } = await supabase.auth.setSession({
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
            });

            if (error) {
              console.error("❌ Error restaurando sesión en Supabase:", error);
              localStorage.removeItem("supabaseSession");
              setSession(null);
            } else {
              setSession(data.session || parsed);
              console.log(
                "✅ Sesión restaurada en Supabase:",
                data.session?.user?.email,
              );
            }
          } catch (e) {
            console.error("❌ Error parseando sesión:", e);
            localStorage.removeItem("supabaseSession");
            setSession(null);
          }
        }
      } catch (error) {
        console.error("❌ Error en restoreSession:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem("supabaseSession", JSON.stringify(session));
        setSession(session);
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("supabaseSession");
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="loading-container">
        <h2>Cargando...</h2>
      </div>
    );
  }

  return (
    <RestauranteProvider initialSession={session}>
      {" "}
      {/* ← PASAR LA SESIÓN */}
      <Routes>
        <Route
          path="/"
          element={!session ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RestauranteProvider>
  );
}

export default App;
