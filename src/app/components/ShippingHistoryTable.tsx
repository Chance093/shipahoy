"use client";
import Orders from "./Orders";
import Pagination from "./Pagination";
import TableLoadingSkeleton from "./TableLoadingSkeleton";
import usePagination from "~/hooks/usePagination";
import useFetchShippingHistory from "~/hooks/useFetchShippingHistory";

export default function ShippingHistoryTable({
  type,
  userId,
  orderCount,
}: {
  type: "user" | "admin";
  userId: string | undefined;
  orderCount: number;
}) {
  const { page, totalPages, incrementPage, decrementPage } = usePagination(orderCount);
  const { shippingHistory, isShippingHistoryLoading } = useFetchShippingHistory(type, page, userId)!;

  if (isShippingHistoryLoading) return <TableLoadingSkeleton title="Shipping History" />;
  if (shippingHistory === undefined) throw new Error("Could not fetch shipping history");

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
