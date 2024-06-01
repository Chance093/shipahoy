"use client";

import { api } from "~/trpc/react";

export default function useFetchInvoices(type: "user" | "admin", page: number, userId: string | undefined) {
  if (type === "user") {
    const { data: invoices, isError: isInvoicesError, error: invoicesError, isLoading: isInvoicesLoading } = api.invoice.getInvoices.useQuery(page);

    if (isInvoicesError) throw invoicesError;

    return { invoices, isInvoicesLoading };
  }

  if (type === "admin") {
    if (!userId) return;
    const {
      data: invoices,
      isError: isInvoicesError,
      error: invoicesError,
      isLoading: isInvoicesLoading,
    } = api.invoice.getInvoicesByUserId.useQuery({ page, userId });

    if (isInvoicesError) throw invoicesError;

    return { invoices, isInvoicesLoading };
  }
}
