import FromAddressForm from "./FromAddressForm";
import ToAddressForm from "./ToAddressForm";
import PackageDimensionForm from "./PackageDimensionForm";

export default function SingleLabelCreation() {
  return (
    <>
      <h1 className="pl-2 text-4xl">Create Single Label</h1>
      <form className="grid grid-cols-2 grid-rows-[1fr_auto] gap-6">
        <FromAddressForm />
        <ToAddressForm />
        <PackageDimensionForm />
      </form>
    </>
  );
}
