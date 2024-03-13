"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useOrganizationList } from "@clerk/nextjs";

export default function useAdmin() {
  const { userMemberships, isLoaded } = useOrganizationList({ userMemberships: true });
  const [userId, setUserId] = useState("");
  const [addedBalance, setAddedBalance] = useState("");

  const { data: orders, refetch: refetchOrders } = api.shippingHistory.getShippingHistoryByUserId.useQuery(userId, { enabled: false });
  const { data: invoices, refetch: refetchInvoices } = api.invoice.getInvoicesByUserId.useQuery(userId, { enabled: false });
  const { data: amount, refetch: refetchBalance } = api.balance.getAmountByUserId.useQuery(userId, { enabled: false });
  const updateBalance = api.balance.updateByUserId.useMutation({
    onSuccess: async () => {
      setAddedBalance("");
      await refetchBalance();
    },
  });

  async function fetchUser() {
    await refetchOrders();
    await refetchInvoices();
    await refetchBalance();
  }

  function addBalance() {
    if (!amount?.amount) return;
    if (!addedBalance) return;
    updateBalance.mutate({ amount: (Number(amount.amount) + Number(addedBalance)).toString(), userId: userId });
  }

  return { userMemberships, isLoaded, userId, setUserId, orders, invoices, amount, fetchUser, addBalance, addedBalance, setAddedBalance };
}
