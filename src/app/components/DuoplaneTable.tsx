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
        <table className="w-full text-left">
          <thead className="text-custom-gray ">
            <tr className="border-b border-gray-600/50">
              <th className="p-4 pb-6 font-normal"></th>
              <th className="p-4 pb-6 font-normal">PO ID</th>
              <th className="p-4 pb-6 font-normal">Buyer</th>
              <th className="p-4 pb-6 font-normal">Address</th>
            </tr>
          </thead>
          <tbody>
            {duoplaneState.map((po) => (
              <>
                <tr key={po.public_reference} className="border-b border-gray-600/50">
                  <td className="p-4 py-6">
                    <button onClick={() => showPartialShipments(po.public_reference)}>v</button>
                  </td>
                  <td className="p-4 py-6">{po.public_reference}</td>
                  <td className="p-4 py-6">
                    {po.shipping_address.first_name} {po.shipping_address.last_name}
                  </td>
                  <td className="p-4 py-6">{po.shipping_address.address_1}</td>
                </tr>
                {po.active ? (
                  <>
                    {shipments.map((shipment) => {
                      if (shipment?.id === po.public_reference)
                        return (
                          <tr key={shipment.id} className="flex flex-col justify-between">
                            {shipment.partialShipments.map((partialShipment) => (
                              <>
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
                                    onChange={(e) =>
                                      handlePartialShipmentInputChange({ qty: Number(e.target.value) }, shipment.id, partialShipment.id)
                                    }
                                    className="text-black"
                                    type="text"
                                    value={partialShipment.qty}
                                  />
                                </div>
                                <button onClick={() => deletePartialShipment(po.public_reference, partialShipment.id)}>
                                  Delete Partial Shipment
                                </button>
                              </>
                            ))}
                          </tr>
                        );
                    })}
                    <button onClick={() => addPartialShipment(po.public_reference, po.shipping_address.first_name, po.shipping_address.address_1)}>
                      Add Shipment
                    </button>
                  </>
                ) : null}
              </>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
