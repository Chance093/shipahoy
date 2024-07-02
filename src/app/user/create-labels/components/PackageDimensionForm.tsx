import { type HandleChange, type FormData, type UpdateWeight } from "~/lib/definitions";

export default function PackageDimensionForm({
  formData,
  handleChange,
  updateWeight,
  errorMessage,
  price,
  isButtonLoading,
}: {
  formData: FormData;
  handleChange: HandleChange;
  updateWeight: UpdateWeight;
  errorMessage: string;
  price: string;
  isButtonLoading: boolean;
}) {
  return (
    <section className="col-start-1 col-end-3 rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
        <h2 className="text-center text-2xl">Package Dimensions</h2>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="service">Service:</label>
          <select name="service" id="service" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
            <option value="usps priority 0-70lbs">USPS Priority 0-70lbs</option>
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="label">Label:</label>
          <select name="label" id="label" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
            <option value="e-VS">e-VS</option>
          </select>
        </div>
        <section className="flex gap-4">
          <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="height">Height (inches):</label>
              <input
                id="height"
                type="number"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                value={formData.Height}
                onChange={(e) => handleChange({ Height: e.target.value })}
                autoComplete="off"
                min="1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="weight">Weight (lbs):</label>
              <input
                id="weight"
                type="number"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                value={formData.Weight}
                onChange={(e) => updateWeight(e.target.value)}
                autoComplete="off"
                min="0"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="length">Length (inches):</label>
              <input
                id="length"
                type="number"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                value={formData.Length}
                onChange={(e) => handleChange({ Length: e.target.value })}
                autoComplete="off"
                min="1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="width">Width (inches):</label>
              <input
                id="width"
                type="number"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                value={formData.Width}
                onChange={(e) => handleChange({ Width: e.target.value })}
                autoComplete="off"
                min="1"
              />
            </div>
          </div>
        </section>
        <section className="flex items-center justify-between">
          <p className="pl-4 text-xl text-red-400">{errorMessage}</p>
          <button
            type="submit"
            disabled={price === "0.00" || isButtonLoading}
            className="w-48 cursor-pointer rounded-md bg-purple p-4 text-center disabled:cursor-default disabled:opacity-50"
          >
            {isButtonLoading ? (
              <div className="lds-ring-button">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              `Purchase $${price}`
            )}
          </button>
        </section>
      </div>
    </section>
  );
}
