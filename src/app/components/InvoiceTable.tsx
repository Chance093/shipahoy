"use client";
import { api } from "~/trpc/react";
import Invoices from "./Invoices";
import { useState } from "react";
import Pagination from "./Pagination";
import TableLoadingSkeleton from "./TableLoadingSkeleton";

export default function InvoiceTable({ type, userId, invoiceCount }: { type: "user" | "admin"; userId: string | undefined; invoiceCount: number }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(invoiceCount / 10);

  const incrementPage = () => {
    if (page >= totalPages) return;
    setPage((prev) => prev + 1);
  };

  const decrementPage = () => {
    if (page === 1) return;
    setPage((prev) => prev - 1);
  };

  if (type === "user") {
    const { data: invoices, isError: isInvoicesError, error: invoicesError, isLoading: isInvoicesLoading } = api.invoice.getInvoices.useQuery(page);
    const {
      data: invoiceCount,
      isError: isInvoiceCountError,
      error: invoiceCountError,
      isLoading: isInvoiceCountLoading,
    } = api.userData.getInvoiceCount.useQuery();
    if (isInvoicesLoading || isInvoiceCountLoading) return <TableLoadingSkeleton title="Invoices" />;
    if (isInvoicesError) throw invoicesError;
    if (isInvoiceCountError) throw invoiceCountError;
    if (invoices === undefined) throw new Error("Could not find shipping history");
    if (invoiceCount === undefined) throw new Error("Could not get order count");

    return (
      <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
          <h2 className="p-2 text-2xl">Invoices</h2>
          <Invoices invoices={invoices} page={page} invoiceCount={invoiceCount} />
          <div className="flex-1"></div>

          <Pagination page={page} decrementPage={decrementPage} incrementPage={incrementPage} totalPages={totalPages} />
        </div>
      </section>
    );
  }

  if (type === "admin") {
    if (!userId) return;
    const {
      data: invoices,
      isError: isInvoicesError,
      error: invoicesError,
      isLoading: isInvoicesLoading,
    } = api.invoice.getInvoicesByUserId.useQuery({ page, userId });
    if (isInvoicesLoading) return <TableLoadingSkeleton title="Invoices" />;
    if (isInvoicesError) throw invoicesError;
    if (invoices === undefined) throw new Error("Could not find shipping history");

    return (
      <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
          <h2 className="p-2 text-2xl">Invoices</h2>
          <Invoices invoices={invoices} page={page} invoiceCount={invoiceCount} />
          <div className="flex-1"></div>

          <Pagination page={page} decrementPage={decrementPage} incrementPage={incrementPage} totalPages={totalPages} />
        </div>
      </section>
    );
  }
}
