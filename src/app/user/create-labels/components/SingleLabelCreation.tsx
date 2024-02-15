export default function SingleLabelCreation() {
  return (
    <>
      <h1 className="pl-2 text-4xl">Create Single Label</h1>
      <form className="grid grid-cols-2 grid-rows-[1fr_auto] gap-6">
        <section className="rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">From</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_name">Name:</label>
              <input
                id="sender_name"
                type="text"
                placeholder=""
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_company" className="field-label">
                Company Name:
              </label>
              <input
                id="sender_company"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_address_line" className="field-label">
                Address:
              </label>
              <input
                id="sender_address_line"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_address_line_2" className="field-label">
                Address 2:
              </label>
              <input
                id="sender_address_line_2"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_zip code" className="field-label">
                Zip Code:
              </label>
              <input
                id="code"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_city" className="field-label">
                City:
              </label>
              <input
                id="sender_city"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_state" className="field-label">
                State:
              </label>
              <input
                id="sender_state"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_country" className="field-label">
                Country:
              </label>
              <input
                id="sender_country"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                value="United States"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_phone" className="field-label">
                Phone Number:
              </label>
              <input
                id="sender_phone"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
          </div>
        </section>
        <section className="rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">To</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_name">Name:</label>
              <input
                id="sender_name"
                type="text"
                placeholder=""
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_company" className="field-label">
                Company Name:
              </label>
              <input
                id="sender_company"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_address_line" className="field-label">
                Address:
              </label>
              <input
                id="sender_address_line"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_address_line_2" className="field-label">
                Address 2:
              </label>
              <input
                id="sender_address_line_2"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_zip code" className="field-label">
                Zip Code:
              </label>
              <input
                id="code"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_city" className="field-label">
                City:
              </label>
              <input
                id="sender_city"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_state" className="field-label">
                State:
              </label>
              <input
                id="sender_state"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_country" className="field-label">
                Country:
              </label>
              <input
                id="sender_country"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                value="United States"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_phone" className="field-label">
                Phone Number:
              </label>
              <input
                id="sender_phone"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                placeholder=""
              />
            </div>
          </div>
        </section>
        <section className="col-start-1 col-end-3 rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">Package Dimensions</h2>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="service">Service:</label>
              <select
                name="service"
                id="service"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
              >
                <option value="usps priority 0-70lbs">
                  USPS Priority 0-70lbs
                </option>
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="label">Label:</label>
              <select
                name="label"
                id="label"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
              >
                <option value="usps priority 0-70lbs">e-VS</option>
              </select>
            </div>
            <section className="flex gap-4">
              <div className="flex flex-1 flex-col gap-8">
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor="height">Height (inches):</label>
                  <input
                    id="height"
                    type="text"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="weight">Weight (lbs):</label>
                  <input
                    id="weight"
                    type="text"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-8">
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor="length">Length (inches):</label>
                  <input
                    id="length"
                    type="text"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="width">Width (inches):</label>
                  <input
                    id="width"
                    type="text"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  />
                </div>
              </div>
            </section>
            <button
              disabled={true}
              className="w-40 cursor-pointer self-end rounded-md bg-purple p-4 text-center opacity-50"
            >
              Purchase $0
            </button>
          </div>
        </section>
      </form>
    </>
  );
}
