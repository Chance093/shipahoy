import { formInputs, statesList } from "~/utils/lists";
import { type FormData, type HandleChange } from "~/utils/definitions";

export default function AddressForm({ formData, handleChange, label }: { formData: FormData; handleChange: HandleChange; label: string }) {
  return (
    <section className="rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
        <h2 className="text-center text-2xl">{label}</h2>
        {formInputs.map((input, idx) => {
          if (label === "From") {
            if (idx > 8) return;
          }
          if (label === "To") {
            if (idx <= 8 || idx >= 18) return;
          }
          if (input.selectInput)
            return (
              <div className="flex flex-col gap-2" key={input.id}>
                <label htmlFor={input.property}>{input.label}</label>
                <select
                  id={input.property}
                  onChange={(e) => handleChange({ [input.property]: e.target.value })}
                  className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  required={input.required}
                >
                  {statesList.map((state, idx) => {
                    return (
                      <option value={state.abbreviation} key={idx} className="border-gray-600/50 bg-[#1a1a1b]">
                        {state.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          else
            return (
              <div className="flex flex-col gap-2" key={input.id}>
                <label htmlFor={input.property}>{input.label}</label>
                <input
                  type="text"
                  id={input.property}
                  onChange={(e) => handleChange({ [input.property]: e.target.value })}
                  value={formData[input.property as keyof typeof formData]}
                  className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  required={input.required}
                  pattern={input.regEx}
                  autoComplete="off"
                  readOnly={input.readOnly}
                />
              </div>
            );
        })}
      </div>
    </section>
  );
}
