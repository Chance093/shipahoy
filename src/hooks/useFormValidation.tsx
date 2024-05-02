"use client";

import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import useCreateLabels from "~/hooks/useCreateLabels";
import { useRouter } from "next/navigation";
import { initialState } from "~/lib/lists";

export default function useFormValidation() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialState);
  const [price, setPrice] = useState("0.00");
  const [errorMessage, setErrorMessage] = useState("");

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
    e.preventDefault();
    if (!balance?.amount) return;
    if (parseFloat(price) === 0) return;
    if (formData.FromStreet === formData.ToStreet) {
      setErrorMessage("Sender Address cannot be the same as Recipient Address.");
      return;
    }
    if (parseFloat(balance.amount) < parseFloat(price)) {
      setErrorMessage("Insufficient funds. Please add more to your balance.");
      return;
    }
    const apiResponse = await createLabels([formData]);
    if (apiResponse instanceof Error) {
      setErrorMessage(`${JSON.stringify(apiResponse)}`);
      return;
    }
    const { tracking, links } = apiResponse;
    storeData(tracking, links, [formData], [price]);
    setPrice("0.00");
    setFormData(initialState);
    const newBalance = parseFloat(balance.amount) - parseFloat(price);
    updateBalance.mutate({ amount: newBalance.toString() });
    setErrorMessage("");
    router.push("/user/dashboard");
    router.refresh();
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
  };
}
