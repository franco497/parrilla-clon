// src/hooks/useBreakpoint.js
import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 601) setBreakpoint("mobile");
      else if (width < 993) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}