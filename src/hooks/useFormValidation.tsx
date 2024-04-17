"use client";

import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import useCreateLabels from "~/hooks/useCreateLabels";
import { useRouter } from "next/navigation";
import { initialState } from "~/lib/lists";
import { useOrganizationList } from "@clerk/nextjs";

export default function useFormValidation() {
  const router = useRouter();

  const { userMemberships, isLoaded } = useOrganizationList({ userMemberships: true });
  const [formData, setFormData] = useState(initialState);
  const [price, setPrice] = useState("0.00");
  const [errorMessage, setErrorMessage] = useState("");

  const { createLabels, storeData } = useCreateLabels();

  const handleChange = (fields: Partial<typeof formData>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  // TODO: Refactor to implement with other weight checking function
  const updateWeight = (value: string) => {
    setFormData((prev) => {
      return { ...prev, Weight: value };
    });
    if (isLoaded) {
      if (!userMemberships.data) throw new Error("Could not find User Role");
      else {
        const adminOrganization = userMemberships.data.find((org) => org.role === "org:admin");
        if (!adminOrganization || adminOrganization.role !== "org:admin") {
          // * If user is not admin
          switch (true) {
            case 0 < parseInt(value) && parseInt(value) <= 7.99:
              setPrice("7.00");
              break;
            case 8 <= parseInt(value) && parseInt(value) <= 14.99:
              setPrice("12.00");
              break;
            case 15 <= parseInt(value) && parseInt(value) <= 24.99:
              setPrice("14.00");
              break;
            case 25 <= parseInt(value) && parseInt(value) <= 34.99:
              setPrice("16.00");
              break;
            case 35 <= parseInt(value) && parseInt(value) <= 44.99:
              setPrice("18.00");
              break;
            case 45 <= parseInt(value) && parseInt(value) <= 54.99:
              setPrice("20.00");
              break;
            case 55 <= parseInt(value) && parseInt(value) <= 64.99:
              setPrice("22.00");
              break;
            case 65 <= parseInt(value) && parseInt(value) <= 70:
              setPrice("24.00");
              break;
            default:
              setPrice("0.00");
          }
        } else {
          // * If user is admin
          switch (true) {
            case 0 < parseInt(value) && parseInt(value) <= 8:
              setPrice("5.50");
              break;
            case 8.1 <= parseInt(value) && parseInt(value) <= 70:
              setPrice("10.00");
              break;
            default:
              setPrice("0.00");
          }
        }
      }
    }
  };

  const updateBalance = api.balance.update.useMutation();

  const balance = api.balance.getAmount.useQuery();

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!balance.data?.amount) return;
    if (parseFloat(price) === 0) return;
    if (formData.FromStreet === formData.ToStreet) {
      setErrorMessage("Sender Address cannot be the same as Recipient Address.");
      return;
    }
    if (parseFloat(balance.data?.amount) < parseFloat(price)) {
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
    const newBalance = parseFloat(balance.data.amount) - parseFloat(price);
    updateBalance.mutate({ amount: newBalance.toString() });
    setErrorMessage("");
    router.push("/user/dashboard");
    router.refresh();
  };

  return { formData, price, errorMessage, handleChange, updateWeight, onFormSubmit };
}
