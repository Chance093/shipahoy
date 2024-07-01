"use client";
import { useState } from "react";

export default function usePagination(totalCount: number, countPerPage = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalCount / countPerPage);

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
