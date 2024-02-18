export default function ToAddressForm() {
  return (
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
  );
}
