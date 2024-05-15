"use client";
import { useState, useEffect } from "react";
import { type Pricing } from "~/lib/definitions";
import { initialPricingState } from "~/lib/lists";
import { api } from "~/trpc/react";

export default function useAdminPricing(userId: string) {
  const {
    data: pricing,
    refetch: refetchPricing,
    isLoading,
    isError: isPricingError,
    error: pricingError,
  } = api.pricing.getPricingByUserId.useQuery(userId, { enabled: false });
  const [pricingInputs, setPricingInputs] = useState<Pricing>(initialPricingState);

  useEffect(() => {
    if (!pricing) return;
    setPricingInputs({ ...pricing });
  }, [pricing]);

  useEffect(() => {
    if (userId === "") return;
    async function refetch() {
      await refetchPricing();
    }
    refetch().catch(console.error);
  }, [userId, refetchPricing]);

  const updatePricing = api.pricing.updatePricingByUserId.useMutation({
    onSuccess: async () => {
      await refetchPricing();
    },
    onError: (err) => {
      throw err;
    },
  });

  const handleChange = (fields: Partial<typeof pricingInputs>) => {
    setPricingInputs((prev) => {
      return { ...prev, ...fields };
    });
  };

  function addPricing() {
    if (!pricing) throw new Error("Could not get pricing for user");
    updatePricing.mutate({
      userId: userId,
      zeroToFour: pricingInputs.zeroToFour,
      fourToEight: pricingInputs.fourToEight,
      eightToFifteen: pricingInputs.eightToFifteen,
      fifteenToTwentyFive: pricingInputs.fifteenToTwentyFive,
      twentyFiveToThirtyFive: pricingInputs.twentyFiveToThirtyFive,
      thirtyFiveToFortyFive: pricingInputs.thirtyFiveToFortyFive,
      fortyFiveToFiftyFive: pricingInputs.fortyFiveToFiftyFive,
      fiftyFiveToSixtyFive: pricingInputs.fiftyFiveToSixtyFive,
      sixtyFiveToSeventy: pricingInputs.sixtyFiveToSeventy,
    });
  }

  return { pricingInputs, handleChange, addPricing, isLoading, isPricingError, pricingError };
}
