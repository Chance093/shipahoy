import FromAddressForm from "./FromAddressForm";
import ToAddressForm from "./ToAddressForm";
import PackageDimensionForm from "./PackageDimensionForm";
import { useFormValidation } from "~/hooks/useFormValidation";

export default function SingleLabelCreation() {
  const [formData, handleChange] = useFormValidation();

  return (
    <>
      <h1 className="pl-2 text-4xl">Create Single Label</h1>
      <form className="grid grid-cols-2 grid-rows-[1fr_auto] gap-6">
        <FromAddressForm formData={formData} handleChange={handleChange} />
        <ToAddressForm />
        <PackageDimensionForm />
      </form>
    </>
  );
}
