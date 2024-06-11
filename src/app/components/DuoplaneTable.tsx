"use client";

import useDuoplane from "~/hooks/useDuoplane";
import { type duoplaneResponseData } from "~/lib/definitions";

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
        <section className="grid-cols-[20px / auto/ auto/ auto] grid w-full text-left">
          <h3 className="p-4 pb-6 font-normal"></h3>
          <h3 className="p-4 pb-6 font-normal">PO ID</h3>
          <h3 className="p-4 pb-6 font-normal">Buyer</h3>
          <h3 className="p-4 pb-6 font-normal">Address</h3>
          {duoplaneState.map((po) => (
            <>
              <button key={po.public_reference + "1"} onClick={() => showPartialShipments(po.public_reference)}>
                v
              </button>
              <p key={po.public_reference + "2"} className="p-4 py-6">
                {po.public_reference}
              </p>
              <p key={po.public_reference + "3"} className="p-4 py-6">
                {po.shipping_address.first_name} {po.shipping_address.last_name}
              </p>
              <p key={po.public_reference + "4"} className="p-4 py-6">
                {po.shipping_address.address_1}
              </p>
              {po.active ? (
                <>
                  {shipments.map((shipment) => {
                    if (shipment.id === po.public_reference) {
                      return shipment.partialShipments.map((partialShipment) => (
                        <>
                          <div key={shipment.id + 1}></div>
                          <div key={shipment.id + 2} className="cols-start-2 col-span-3 flex justify-between">
                            <div className="flex gap-4">
                              <label htmlFor="">weight</label>
                              <input
                                onChange={(e) => handlePartialShipmentInputChange({ weight: e.target.value }, shipment.id, partialShipment.id)}
                                className="text-black"
                                type="text"
                                value={partialShipment.weight}
                              />
                            </div>
                            <div className="flex gap-4">
                              <label htmlFor="">qty</label>
                              <input
                                onChange={(e) => handlePartialShipmentInputChange({ qty: Number(e.target.value) }, shipment.id, partialShipment.id)}
                                className="text-black"
                                type="text"
                                value={partialShipment.qty}
                              />
                            </div>
                            <button onClick={() => deletePartialShipment(po.public_reference, partialShipment.id)}>Delete Partial Shipment</button>
                          </div>
                        </>
                      ));
                    }
                  })}
                  <button
                    key={po.public_reference + "5"}
                    className="col-span-4"
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
