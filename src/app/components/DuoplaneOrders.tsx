import { ArrowUturnUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { type DuoplaneState, type PoOrders, type Shipment } from "~/lib/definitions";
import Pagination from "./Pagination";
import { type FormEvent } from "react";

export default function DuoplaneOrders({
  duoplaneState,
  poOrders,
  handleWeightChange,
  showShipments,
  addShipment,
  deleteShipment,
  submitDuoplane,
  errorMessage,
  page,
  totalPages,
  incrementPage,
  decrementPage,
}: {
  duoplaneState: DuoplaneState[];
  poOrders: PoOrders;
  handleWeightChange: (field: Partial<Shipment>, poOrderId: string, shipmentId: number) => void;
  showShipments: (id: string) => void;
  addShipment: (id: string, buyer: string, address: string) => void;
  deleteShipment: (poOrderId: string, shipmentId: number) => void;
  submitDuoplane: (e: FormEvent<Element>) => void;
  errorMessage: string;
  page: number;
  totalPages: number;
  incrementPage: () => void;
  decrementPage: () => void;
}) {
  return (
    <>
      <h2 className="p-2 text-2xl">Duoplane Orders</h2>
      <form id="duoplane-form" className="grid w-full grid-cols-[80px_auto_auto_auto] text-left" onSubmit={submitDuoplane}>
        <h3 className="col-start-1 p-4 pb-6 font-normal"></h3>
        <h3 className="col-start-2 p-4 pb-6 font-normal">PO ID</h3>
        <h3 className="col-start-3 p-4 pb-6 font-normal">Buyer</h3>
        <h3 className="col-start-4 p-4 pb-6 font-normal">Address</h3>
        {duoplaneState.map((po) => (
          <PO
            key={po.public_reference}
            po={po}
            poOrders={poOrders}
            handleWeightChange={handleWeightChange}
            showShipments={showShipments}
            deleteShipment={deleteShipment}
            addShipment={addShipment}
          />
        ))}
      </form>
      <div className="ml-4 text-red-400">{errorMessage}</div>
      <section className="mt-auto flex justify-between">
        <Pagination page={page} totalPages={totalPages} incrementPage={incrementPage} decrementPage={decrementPage} />
        <input
          type="submit"
          form="duoplane-form"
          className="m-4 h-14 w-52 cursor-pointer rounded-md bg-purple p-4 text-center disabled:opacity-50"
          value="Checkout"
        />
      </section>
    </>
  );
}

function PO({
  po,
  poOrders,
  handleWeightChange,
  showShipments,
  deleteShipment,
  addShipment,
}: {
  po: DuoplaneState;
  poOrders: PoOrders;
  handleWeightChange: (field: Partial<Shipment>, poOrderId: string, shipmentId: number) => void;
  showShipments: (id: string) => void;
  deleteShipment: (poOrderId: string, shipmentId: number) => void;
  addShipment: (id: string, buyer: string, address: string) => void;
}) {
  return (
    <>
      <div className="border-t border-gray-600/50 p-4 py-6" onClick={() => showShipments(po.public_reference)}>
        {po.active ? <ChevronUpIcon className="w-8 cursor-pointer" /> : <ChevronDownIcon className="w-8 cursor-pointer" />}
      </div>
      <p className="border-t border-gray-600/50 p-4 py-6">{po.public_reference}</p>
      <p className="border-t border-gray-600/50 p-4 py-6">
        {po.shipping_address.first_name} {po.shipping_address.last_name}
      </p>
      <p className="border-t border-gray-600/50 p-4 py-6">{po.shipping_address.address_1}</p>
      {po.active && (
        <>
          {poOrders.map((poOrder) => {
            if (poOrder.id === po.public_reference) {
              return poOrder.shipments.map((shipment) => (
                <Shipment
                  key={shipment.id}
                  handleWeightChange={handleWeightChange}
                  deleteShipment={deleteShipment}
                  poOrderId={poOrder.id}
                  shipment={shipment}
                />
              ));
            }
          })}
          <button
            className="col-span-4 mb-6 ml-20 w-40 cursor-pointer rounded-md bg-[#b4a3d8] p-1 text-black"
            onClick={() =>
              addShipment(
                po.public_reference,
                `${po.shipping_address.first_name} ${po.shipping_address.last_name}`,
                `${po.shipping_address.address_1}${po.shipping_address.address_2 ? ", " + po.shipping_address.address_2 : ""}, ${
                  po.shipping_address.city
                }, ${po.shipping_address.province} ${po.shipping_address.post_code}`,
              )
            }
            type="button"
          >
            Add Shipment
          </button>
        </>
      )}
    </>
  );
}

function Shipment({
  handleWeightChange,
  deleteShipment,
  poOrderId,
  shipment,
}: {
  handleWeightChange: (field: Partial<Shipment>, poOrderId: string, shipmentId: number) => void;
  deleteShipment: (poOrderId: string, shipmentId: number) => void;
  poOrderId: string;
  shipment: Shipment;
}) {
  return (
    <>
      <div></div>
      <div className="cols-start-2 col-span-3 flex items-end justify-start gap-8 pb-8">
        <div>
          <ArrowUturnUpIcon className="w-6 rotate-90 pb-4 text-gray-600" />
        </div>
        <input
          onChange={(e) => handleWeightChange({ weight: e.target.value }, poOrderId, shipment.id)}
          className="border-b border-gray-600/50 bg-black bg-opacity-0 p-2 placeholder:italic focus:outline-none"
          type="text"
          value={shipment.weight}
          placeholder="weight (lbs)"
          required
        />
        <div className="cursor-pointer" onClick={() => deleteShipment(poOrderId, shipment.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </div>
    </>
  );
}
