"use client";

import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import useCreateLabels from "~/hooks/useCreateLabels";
import { useRouter } from "next/navigation";
import { initialState } from "~/lib/lists";
import { FormUIError, LabelUploadError, OrderAndLabelCountError, RedirectError, CostCalculationError } from "~/lib/customErrors";
import { AxiosError } from "axios";
import { calculateCost } from "~/lib/calculateCost";

export default function useFormValidation() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialState);
  const [price, setPrice] = useState("0.00");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [thrownError, setThrownError] = useState<Error | null>();

  const { createLabels, storeData } = useCreateLabels();

  const handleChange = (fields: Partial<typeof formData>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const { data: userPricing, isError: isUserPricingError, error: userPricingError } = api.pricing.getPricing.useQuery();

  const updateWeight = (value: string) => {
    try {
      // * Set weight state
      setFormData((prev) => {
        return { ...prev, Weight: value };
      });

      // * Check if user has pricing
      if (userPricing === undefined) {
        setErrorMessage("Could not get user pricing");
        setPrice("0.00");
        return;
      }

      // * Calculate cost of label and set price
      const prices = calculateCost([value], userPricing);
      setPrice(Number(prices[0]).toFixed(2).toString());
      setErrorMessage("");
    } catch (err) {
      if (err instanceof CostCalculationError) {
        setErrorMessage(err.message);
        setPrice("0.00");
      } else {
        throw err;
      }
    }
  };

  const updateBalance = api.balance.update.useMutation({
    onError: (err) => {
      throw err;
    },
  });

  const { data: balance, isError: isBalanceError, error: balanceError } = api.balance.getAmount.useQuery();

  const onFormSubmit = async (e: FormEvent) => {
    try {
      // * Reset state
      e.preventDefault();
      setErrorMessage("");
      setThrownError(null);

      // * Start loading state
      setIsButtonLoading(true);

      // * If no balance found, end execution
      if (!balance?.amount) return;

      // * If label creation price is 0, throw error
      if (Number(price) === 0) throw new FormUIError("Price must be greater than 0 to create a shipment");

      // * If from and to address match, throw error
      if (formData.FromStreet === formData.ToStreet) {
        throw new FormUIError("Sender Address cannot be the same as Recipient Address.");
      }

      // * If not enough balance, throw error
      if (Number(balance.amount) < Number(price)) {
        throw new FormUIError("Insufficient funds. Please add more to your balance.");
      }

      // * Create labels with weship
      const { tracking, links } = await createLabels([formData]);
      const newBalance = Number(balance.amount) - Number(price);

      // * Update db with shipping labels and new balance
      await storeData(tracking, links, [formData], [price]);
      updateBalance.mutate({ amount: String(newBalance) });

      // * Reset states and redirect to home page
      setPrice("0.00");
      setFormData(initialState);
      setIsButtonLoading(false);
      router.push("/user/dashboard");
      router.refresh();
    } catch (err) {
      setIsButtonLoading(false);
      if (err instanceof Error) {
        // * If error is FormUIError, display error to user
        if (err instanceof FormUIError) {
          setErrorMessage(err.message);
        }

        // * If error was from store data, redirect to error page and display error
        else if (err instanceof LabelUploadError || err instanceof OrderAndLabelCountError) {
          setThrownError(new RedirectError(err.message));
        }

        // * If error is weship, redirect to error page and display error
        else if (err instanceof AxiosError) {
          setThrownError(new RedirectError("The server for our service provider is down. Please contact us."));
          console.error(err);
        }

        // * Catch all error
        else {
          setThrownError(new Error(err.message));
        }
      }
    }
  };

  return {
    formData,
    price,
    errorMessage,
    handleChange,
    updateWeight,
    onFormSubmit,
    isBalanceError,
    isUserPricingError,
    balanceError,
    userPricingError,
    isButtonLoading,
    thrownError,
  };
}
