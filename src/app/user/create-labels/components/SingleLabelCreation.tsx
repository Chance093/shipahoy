export default function SingleLabelCreation() {
  return (
    <>
      <h1 className="pl-2 text-4xl">Create Single Label</h1>
      <form className="grid grid-cols-2 grid-rows-[auto_1fr] gap-6">
        <section className="col-start-1 col-end-3 row-start-1 row-end-2 rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">Package Dimensions</h2>
            <p>Service: USPS Priority 0-70lbs</p>
            <p>Label: e-VS</p>
            <section className="flex gap-4">
              <div className="flex flex-1 gap-2">
                <div className="flex flex-col gap-8">
                  <label htmlFor="weight">Weight:</label>
                  <label htmlFor="length">Length:</label>
                </div>
                <div className="flex flex-1 flex-col gap-8">
                  <input
                    id="weight"
                    type="text"
                    placeholder="lbs"
                    className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                  />
                  <input
                    id="length"
                    type="text"
                    placeholder="inches"
                    className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                  />
                </div>
              </div>
              <div className="flex flex-1 gap-2">
                <div className="flex flex-col gap-8">
                  <label htmlFor="width">Width:</label>
                  <label htmlFor="height">Height:</label>
                </div>
                <div className="flex flex-1 flex-col gap-8">
                  <input
                    id="width"
                    type="text"
                    placeholder="inches"
                    className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                  />
                  <input
                    id="height"
                    type="text"
                    placeholder="inches"
                    className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                  />
                </div>
              </div>
            </section>
          </div>
        </section>
        <section className="rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">From Address</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_name">Name:</label>
              <input
                id="sender_name"
                type="text"
                placeholder=""
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_company" className="field-label">
                Company Name:
              </label>
              <input
                id="sender_company"
                type="text"
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                value="United States"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_phone" className="field-label">
                Phone Number:
              </label>
              <input
                id="sender_phone"
                type="text"
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                placeholder=""
              />
            </div>
          </div>
        </section>
        <section className="rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">To Address</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_name">Name:</label>
              <input
                id="sender_name"
                type="text"
                placeholder=""
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_company" className="field-label">
                Company Name:
              </label>
              <input
                id="sender_company"
                type="text"
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
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
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                value="United States"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sender_phone" className="field-label">
                Phone Number:
              </label>
              <input
                id="sender_phone"
                type="text"
                className="rounded-md border-2 border-gray-600/50 bg-black bg-opacity-0 p-2"
                placeholder=""
              />
            </div>
          </div>
        </section>
      </form>
    </>
  );
}
