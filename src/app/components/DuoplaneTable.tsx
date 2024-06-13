"use client";

import useDuoplane from "~/hooks/useDuoplane";
import { type duoplaneResponseData } from "~/lib/definitions";
import { ChevronDownIcon, ArrowUturnUpIcon } from "@heroicons/react/24/solid";

export default function DuoplaneTable({ data }: { data: duoplaneResponseData }) {
  const { duoplaneState, shipments, addPartialShipment, deletePartialShipment, showPartialShipments, handlePartialShipmentInputChange } =
    useDuoplane(data);

  return (
    <>
      {duoplaneState.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-8">
          <p className="text-2xl">You have no orders!</p>
        </div>
      ) : (
        <section className="grid w-full grid-cols-[80px_auto_auto_auto] text-left">
          <h3 className="col-start-1 p-4 pb-6 font-normal"></h3>
          <h3 className="col-start-2 p-4 pb-6 font-normal">PO ID</h3>
          <h3 className="col-start-3 p-4 pb-6 font-normal">Buyer</h3>
          <h3 className="col-start-4 p-4 pb-6 font-normal">Address</h3>
          {duoplaneState.map((po) => (
            <>
              <div
                key={po.public_reference + "1"}
                className="border-t border-gray-600/50 p-4 py-6"
                onClick={() => showPartialShipments(po.public_reference)}
              >
                <ChevronDownIcon className="w-8" />
              </div>
              <p key={po.public_reference + "2"} className="border-t border-gray-600/50 p-4 py-6">
                {po.public_reference}
              </p>
              <p key={po.public_reference + "3"} className="border-t border-gray-600/50 p-4 py-6">
                {po.shipping_address.first_name} {po.shipping_address.last_name}
              </p>
              <p key={po.public_reference + "4"} className="border-t border-gray-600/50 p-4 py-6">
                {po.shipping_address.address_1}
              </p>
              {po.active ? (
                <>
                  {shipments.map((shipment) => {
                    if (shipment.id === po.public_reference) {
                      return shipment.partialShipments.map((partialShipment) => (
                        <>
                          <div key={shipment.id + 1}></div>
                          <div key={shipment.id + 2} className="cols-start-2 col-span-3 flex items-end justify-start gap-8 pb-8">
                            <div>
                              <ArrowUturnUpIcon className="w-6 rotate-90 text-gray-600" />
                            </div>
                            <input
                              onChange={(e) => handlePartialShipmentInputChange({ weight: e.target.value }, shipment.id, partialShipment.id)}
                              className="border-b border-gray-600/50 bg-black bg-opacity-0 p-2 placeholder:italic focus:outline-none"
                              type="text"
                              value={partialShipment.weight}
                              placeholder="weight (lbs)"
                            />
                            <input
                              onChange={(e) => handlePartialShipmentInputChange({ qty: e.target.value }, shipment.id, partialShipment.id)}
                              className="border-b border-gray-600/50 bg-black bg-opacity-0 p-2 placeholder:italic focus:outline-none"
                              type="text"
                              value={partialShipment.qty}
                              placeholder="qty"
                            />
                            <div className="cursor-pointer" onClick={() => deletePartialShipment(po.public_reference, partialShipment.id)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 w-8"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ));
                    }
                  })}
                  <button
                    key={po.public_reference + "5"}
                    className="col-span-4 mb-6 ml-20 w-40 cursor-pointer rounded-md bg-[#b4a3d8] p-1 text-black"
                    onClick={() => addPartialShipment(po.public_reference, po.shipping_address.first_name, po.shipping_address.address_1)}
                  >
                    Add Shipment
                  </button>
                </>
              ) : null}
            </>
          ))}
        </section>
      )}
    </>
  );
}
