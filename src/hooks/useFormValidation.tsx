"use client";

import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import useCreateLabels from "~/hooks/useCreateLabels";
import { useRouter } from "next/navigation";
import { initialState } from "~/lib/lists";
import { FormUIError, LabelCreationError } from "~/lib/customErrors";
import { AxiosError } from "axios";

export default function useFormValidation() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialState);
  const [price, setPrice] = useState("0.00");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const { createLabels, storeData } = useCreateLabels();

  const handleChange = (fields: Partial<typeof formData>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const { data: userPricing, isError: isUserPricingError, error: userPricingError } = api.pricing.getPricing.useQuery();

  // TODO: Refactor to implement with other weight checking function
  const updateWeight = (value: string) => {
    setFormData((prev) => {
      return { ...prev, Weight: value };
    });
    const weight = Number(value);
    switch (true) {
      case 0 < weight && weight <= 3.99: {
        const price = userPricing?.zeroToFour;
        setPrice(`${price}`);
        break;
      }
      case 4 <= weight && weight <= 7.99: {
        const price = userPricing?.fourToEight;
        setPrice(`${price}`);
        break;
      }
      case 8 <= weight && weight <= 14.99: {
        const price = userPricing?.eightToFifteen;
        setPrice(`${price}`);
        break;
      }
      case 15 <= weight && weight <= 24.99: {
        const price = userPricing?.fifteenToTwentyFive;
        setPrice(`${price}`);
        break;
      }
      case 25 <= weight && weight <= 34.99: {
        const price = userPricing?.twentyFiveToThirtyFive;
        setPrice(`${price}`);
        break;
      }
      case 35 <= weight && weight <= 44.99: {
        const price = userPricing?.thirtyFiveToFortyFive;
        setPrice(`${price}`);
        break;
      }
      case 45 <= weight && weight <= 54.99: {
        const price = userPricing?.fortyFiveToFiftyFive;
        setPrice(`${price}`);
        break;
      }
      case 55 <= weight && weight <= 64.99: {
        const price = userPricing?.fiftyFiveToSixtyFive;
        setPrice(`${price}`);
        break;
      }
      case 65 <= weight && weight <= 70: {
        const price = userPricing?.sixtyFiveToSeventy;
        setPrice(`${price}`);
        break;
      }
      default: {
        throw new Error("Weight is out of range");
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
      e.preventDefault();
      setErrorMessage("");

      // * Start loading state
      setIsButtonLoading(true);

      // * If no balance found, end execution
      if (!balance?.amount) return;

      // * If label creation price is 0, throw error
      if (parseFloat(price) === 0) throw new FormUIError("Price must be greater than 0 to create a shipment");

      // * If from and to address match, throw error
      if (formData.FromStreet === formData.ToStreet) {
        throw new FormUIError("Sender Address cannot be the same as Recipient Address.");
      }

      // * If not enough balance, throw error
      if (parseFloat(balance.amount) < parseFloat(price)) {
        throw new FormUIError("Insufficient funds. Please add more to your balance.");
      }

      // * Create labels with weship
      const { tracking, links } = await createLabels([formData]);
      const newBalance = parseFloat(balance.amount) - parseFloat(price);

      // * Update db with shipping labels and new balance
      await storeData(tracking, links, [formData], [price]);
      updateBalance.mutate({ amount: newBalance.toString() });

      // * Reset states and redirect to home page
      setPrice("0.00");
      setFormData(initialState);
      setIsButtonLoading(false);
      router.push("/user/dashboard");
      router.refresh();
    } catch (err) {
      setIsButtonLoading(false);
      if (err instanceof FormUIError) {
        setErrorMessage(err.message);
      } else if (err instanceof AxiosError) {
        throw err;
      }
      throw new LabelCreationError("Labels have been created but were not successfully stored. Contact us to retrieve them.");
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
  };
}
