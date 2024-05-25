"use client";
import { useState } from "react";

export default function usePagination(count: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(count / 10);

  const incrementPage = () => {
    if (page >= totalPages) return;
    setPage((prev) => prev + 1);
  };

  const decrementPage = () => {
    if (page === 1) return;
    setPage((prev) => prev - 1);
  };

  return { page, totalPages, incrementPage, decrementPage };
}
