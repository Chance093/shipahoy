"use client";

import { api } from "~/trpc/react";

export default function useFetchShippingHistory(type: "user" | "admin", page: number, userId: string | undefined) {
  if (type === "user") {
    const {
      data: shippingHistory,
      isError: isShippingHistoryError,
      error: shippingHistoryError,
      isLoading: isShippingHistoryLoading,
    } = api.shippingHistory.getShippingHistory.useQuery(page);

    if (isShippingHistoryError) throw shippingHistoryError;

    return { shippingHistory, isShippingHistoryLoading };
  }

  if (type === "admin") {
    if (!userId) return;
    const {
      data: shippingHistory,
      isError: isShippingHistoryError,
      error: shippingHistoryError,
      isLoading: isShippingHistoryLoading,
    } = api.shippingHistory.getShippingHistoryByUserId.useQuery({ page, userId });

    if (isShippingHistoryError) throw shippingHistoryError;

    return { shippingHistory, isShippingHistoryLoading };
  }
}
