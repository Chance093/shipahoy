"use client";
import { api } from "~/trpc/react";
import Orders from "./Orders";
import { useState } from "react";

export default function ShippingHistoryTable({ type, userId }: { type: "user" | "admin"; userId: string | undefined }) {
  const [page, setPage] = useState(1);

  const incrementPage = () => {
    setPage((prev) => prev + 1);
  };

  const decrementPage = () => {
    setPage((prev) => prev - 1);
  };

  if (type === "user") {
    const {
      data: shippingHistory,
      isError: isShippingHistoryError,
      error: shippingHistoryError,
      isLoading: isShippingHistoryLoading,
    } = api.shippingHistory.getShippingHistoryByPage.useQuery(page);
    if (isShippingHistoryLoading) return null;
    if (isShippingHistoryError) throw shippingHistoryError;
    if (shippingHistory === undefined) throw new Error("Could not find shipping history");

    return (
      <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
          <h2 className="p-2 text-2xl">Shipping History</h2>
          <Orders shippingHistory={shippingHistory} />
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
    } = api.shippingHistory.getShippingHistoryByUserAndPage.useQuery({ page, userId });
    if (isShippingHistoryLoading) return null;
    if (isShippingHistoryError) throw shippingHistoryError;
    if (shippingHistory === undefined) throw new Error("Could not find shipping history");

    return (
      <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
          <h2 className="p-2 text-2xl">Shipping History</h2>
          <Orders shippingHistory={shippingHistory} />
        </div>
      </section>
    );
  }
}
