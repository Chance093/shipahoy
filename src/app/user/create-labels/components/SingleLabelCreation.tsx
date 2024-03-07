"use client";

import useFormValidation from "~/hooks/useFormValidation";
import AddressForm from "./AddressForm";
import PackageDimensionForm from "./PackageDimensionForm";

export default function SingleLabelCreation() {
  const { formData, price, errorMessage, handleChange, updateWeight, onFormSubmit } = useFormValidation();

  return (
    <>
      <h1 className="pl-2 text-4xl">Create Single Label</h1>
      <form onSubmit={(e) => onFormSubmit(e)} className="grid grid-cols-2 grid-rows-[1fr_auto] gap-6">
        <AddressForm label="From" handleChange={handleChange} formData={formData} />
        <AddressForm label="To" handleChange={handleChange} formData={formData} />
        <PackageDimensionForm handleChange={handleChange} formData={formData} updateWeight={updateWeight} errorMessage={errorMessage} price={price} />
      </form>
    </>
  );
}
