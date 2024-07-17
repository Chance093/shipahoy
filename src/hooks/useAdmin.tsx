"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useOrganizationList } from "@clerk/nextjs";

export default function useAdmin() {
  const { userMemberships, isLoaded } = useOrganizationList({ userMemberships: true });
  const [userId, setUserId] = useState("");
  const [addedBalance, setAddedBalance] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const {
    data: amount,
    refetch: refetchBalance,
    isError: isAmountError,
    error: amountError,
  } = api.balance.getAmountByUserId.useQuery(userId, { enabled: false });

  const {
    data: counts,
    refetch: refetchCounts,
    isError: isCountsError,
    error: countsError,
  } = api.userData.getUserDataByUserId.useQuery(userId, { enabled: false });

  const updateBalance = api.balance.updateByUserId.useMutation({
    onSuccess: async () => {
      setAddedBalance("");
      await refetchBalance();
    },
    onError: (err) => {
      throw err;
    },
  });
  const addInvoice = api.invoice.addByUserId.useMutation({
    onSuccess: () => {
      setPaymentMethod("");
    },
    onError: (err) => {
      throw err;
    },
  });
  const incrementInvoiceCount = api.userData.updateInvoiceCount.useMutation();

  async function fetchUser() {
    await refetchBalance();
    await refetchCounts();
  }

  function addBalance() {
    if (!amount?.amount) return;
    if (!amount?.id) return;
    if (!addedBalance) return;
    updateBalance.mutate({ amount: String(Number(amount.amount) + Number(addedBalance)), userId: userId });
    addInvoice.mutate({ userId: userId, balanceId: Number(amount.id), amount: addedBalance, paymentMethod: paymentMethod, paymentStatusId: 1 });
    incrementInvoiceCount.mutate({ incrementValue: 1 });
  }

  return {
    userMemberships,
    isLoaded,
    userId,
    setUserId,
    amount,
    isAmountError,
    amountError,
    fetchUser,
    addBalance,
    addedBalance,
    setAddedBalance,
    paymentMethod,
    setPaymentMethod,
    counts,
    isCountsError,
    countsError,
  };
}
