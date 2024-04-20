"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useOrganizationList } from "@clerk/nextjs";
import { initialPricingState } from "~/lib/lists";

export default function useAdmin() {
  const { userMemberships, isLoaded } = useOrganizationList({ userMemberships: true });
  const [userId, setUserId] = useState("");
  const [addedBalance, setAddedBalance] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const { data: orders, refetch: refetchOrders } = api.shippingHistory.getShippingHistoryByUserId.useQuery(userId, { enabled: false });
  const { data: invoices, refetch: refetchInvoices } = api.invoice.getInvoicesByUserId.useQuery(userId, { enabled: false });
  const { data: amount, refetch: refetchBalance } = api.balance.getAmountByUserId.useQuery(userId, { enabled: false });
  const { data: pricing, refetch: refetchPricing } = api.pricing.getPricingByUserId.useQuery(userId, {
    enabled: false,
    onSuccess: (data) => {
      console.log(data);
      setPricingData(data ?? initialPricingState);
    },
  });

  const updateBalance = api.balance.updateByUserId.useMutation({
    onSuccess: async () => {
      setAddedBalance("");
      await refetchBalance();
    },
  });
  const updateInvoice = api.invoice.addByUserId.useMutation({
    onSuccess: async () => {
      setPaymentMethod("");
      await refetchInvoices();
    },
  });

  const updatePricing = api.pricing.update.useMutation({
    onSuccess: async () => {
      await refetchPricing();
    },
  });

  const [pricingData, setPricingData] = useState(pricing ?? initialPricingState);
  useEffect(() => {
    setPricingData(pricing ?? initialPricingState);
  }, [pricing]);

  async function fetchUser() {
    await refetchOrders();
    await refetchInvoices();
    await refetchBalance();
    await refetchPricing();
  }

  function addBalance() {
    if (!amount?.amount) return;
    if (!amount?.id) return;
    if (!addedBalance) return;
    updateBalance.mutate({ amount: (Number(amount.amount) + Number(addedBalance)).toString(), userId: userId });
    updateInvoice.mutate({ userId: userId, balanceId: Number(amount.id), amount: addedBalance, paymentMethod: paymentMethod, paymentStatusId: 1 });
  }

  const updatePricingData = () => {
    if (pricingData === undefined) return;
    updatePricing.mutate({
      zeroToFour: pricingData.zeroToFour,
      fourToEight: pricingData.fourToEight,
      eightToFifteen: pricingData.eightToFifteen,
      fifteenToTwentyFive: pricingData.fifteenToTwentyFive,
      twentyFiveToThirtyFive: pricingData.twentyFiveToThirtyFive,
      thirtyFiveToFortyFive: pricingData.thirtyFiveToFortyFive,
      fortyFiveToFiftyFive: pricingData.fortyFiveToFiftyFive,
      fiftyFiveToSixtyFive: pricingData.fiftyFiveToSixtyFive,
      sixtyFiveToSeventy: pricingData.sixtyFiveToSeventy,
    });
  };

  return {
    userMemberships,
    isLoaded,
    userId,
    setUserId,
    orders,
    invoices,
    amount,
    fetchUser,
    addBalance,
    addedBalance,
    setAddedBalance,
    paymentMethod,
    setPaymentMethod,
    updatePricingData,
    pricingData,
    setPricingData,
  };
}
