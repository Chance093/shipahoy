"use client";
import { api } from "~/trpc/react";
import Orders from "./Orders";
import { useState } from "react";
import Pagination from "./Pagination";
import TableLoadingSkeleton from "./TableLoadingSkeleton";

export default function ShippingHistoryTable({
  type,
  userId,
  orderCount,
}: {
  type: "user" | "admin";
  userId: string | undefined;
  orderCount: number;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(orderCount / 10);

  const incrementPage = () => {
    if (page >= totalPages) return;
    setPage((prev) => prev + 1);
  };

  const decrementPage = () => {
    if (page === 1) return;
    setPage((prev) => prev - 1);
  };

  if (type === "user") {
    const {
      data: shippingHistory,
      isError: isShippingHistoryError,
      error: shippingHistoryError,
      isLoading: isShippingHistoryLoading,
    } = api.shippingHistory.getShippingHistory.useQuery(page);
    if (isShippingHistoryLoading) return <TableLoadingSkeleton title="Shipping History" />;
    if (isShippingHistoryError) throw shippingHistoryError;
    if (shippingHistory === undefined) throw new Error("Could not find shipping history");

    return (
      <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
          <h2 className="p-2 text-2xl">Shipping History</h2>

          <Orders shippingHistory={shippingHistory} page={page} orderCount={orderCount} />
          <div className="flex-1"></div>
          <Pagination page={page} decrementPage={decrementPage} incrementPage={incrementPage} totalPages={totalPages} />
        </div>
      </section>
    );
  }

  if (type === "admin") {
    if (!userId) return;
    const {
      data: shippingHistory,
      isError: isShippingHistoryError,
      error: shippingHistoryError,
      isLoading: isShippingHistoryLoading,
    } = api.shippingHistory.getShippingHistoryByUserId.useQuery({ page, userId });
    if (isShippingHistoryLoading) return <TableLoadingSkeleton title="Shipping History" />;
    if (isShippingHistoryError) throw shippingHistoryError;
    if (shippingHistory === undefined) throw new Error("Could not find shipping history");

    return (
      <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
          <h2 className="p-2 text-2xl">Shipping History</h2>
          <Orders shippingHistory={shippingHistory} page={page} orderCount={orderCount} />
          <div className="flex-1"></div>
          <Pagination page={page} decrementPage={decrementPage} incrementPage={incrementPage} totalPages={totalPages} />
        </div>
      </section>
    );
  }
}
