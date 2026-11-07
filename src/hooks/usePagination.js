// src/hooks/usePagination.js
import { useState, useEffect, useMemo } from "react";

export function usePagination(items, { itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Si el itemsPerPage cambia (resize), ajustar página actual
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    goToNext: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    goToPrev: () => setCurrentPage((p) => Math.max(p - 1, 1)),
  };
}