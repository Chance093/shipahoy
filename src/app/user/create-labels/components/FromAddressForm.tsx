"use client";
import { type FormData } from "~/hooks/useFormValidation";

type HandleChangeFunction = (fields: Partial<FormData>) => void;

const formInputs = [
  { id: 31, label: "Name", property: "fromName" },
  { id: 32, label: "Company Name", property: "fromCompanyName" },
  { id: 33, label: "Address", property: "fromAddress" },
  { id: 34, label: "Address 2", property: "fromAddress2" },
  { id: 35, label: "Zip Code", property: "fromZipCode" },
  { id: 36, label: "City", property: "fromCity" },
  { id: 37, label: "State", property: "fromState" },
  { id: 38, label: "Country", property: "fromCountry" },
  { id: 39, label: "Phone Number", property: "fromPhoneNumber" },
];

export default function FromAddressForm(
  formData: FormData,
  handleChange: HandleChangeFunction,
) {
  return (
    <section className="rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
        <h2 className="text-center text-2xl">From</h2>
        <h2>{formData.fromName}</h2>
        {formInputs.map((input) => (
          <div className="flex flex-col gap-2" key={input.id}>
            <label htmlFor={input.property}>{input.label}</label>
            <input
              type="text"
              id={input.property}
              onChange={(e) => handleChange({ fromName: e.target.value })}
              value={formData.fromName}
              className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
