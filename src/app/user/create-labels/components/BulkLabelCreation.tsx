"use client";
import Modal from "~/app/components/Modal";
import useHandleCSV from "~/hooks/useHandleCSV";

export default function BulkLabelCreation() {
  const { submitOrder, fileName, csvHandlingHelper, totalPrice, showErrorModal, renderableErrorFlags } = useHandleCSV();

  return (
    <>
      <form onSubmit={submitOrder} className="rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col gap-8 rounded-2xl bg-radial-gradient p-5">
          <h2 className="text-center text-2xl">Upload CSV</h2>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="service">Service:</label>
            <select name="service" id="service" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
              <option value="usps priority 0-70lbs">USPS Priority 0-70lbs</option>
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="label">Label:</label>
            <select name="label" id="label" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
              <option value="usps priority 0-70lbs">e-VS</option>
            </select>
          </div>

          <div className="flex justify-between">
            <label htmlFor="upload_csv" className="w-44 cursor-pointer items-start rounded-md bg-[#b4a3d8] p-4 text-center text-black">
              {fileName.length > 13 ? fileName.substring(0, 13) + " . . ." : fileName}
            </label>
            <input onChange={csvHandlingHelper} id="upload_csv" type="file" accept=".csv" className="hidden" />
            <button
              disabled={totalPrice === "0.00" ? true : false}
              className="w-52 cursor-pointer items-start rounded-md bg-purple p-4 text-center disabled:opacity-50"
            >
              Purchase ${totalPrice}
            </button>
          </div>
        </div>
      </form>
      <Modal
        showModal={showErrorModal}
        title="Your CSV is invalid."
        onClose={() => {
          return 0;
        }}
      >
        <div className="flex flex-col">
          {renderableErrorFlags.map((errorFlag, index) => (
            <div key={index} className="text-warning">
              {errorFlag}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
