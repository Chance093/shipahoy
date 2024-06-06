"use client";

import { useState } from "react";
import { type Shipments, type duoplaneResponseData } from "~/lib/definitions";

export default function DuoplaneTable({ data }: { data: duoplaneResponseData }) {
  const duoplaneData = data.map((data) => ({ ...data, active: false }));
  const [duoplaneState, setDuoplaneState] = useState(duoplaneData);
  const [shipments, setShipments] = useState<Shipments>([]);
  const handleClick = (id: string, buyer: string, address: string) => {
    const newPO = {
      id,
      buyer,
      address,
      partialShipments: [
        {
          weight: "",
          qty: 0,
        },
      ],
    };
    setShipments((prev) => [...prev, newPO]);
  };

  const dropDown = (id: string) => {
    const updatedDuoplaneState = duoplaneState.map((state) => {
      if (state.public_reference === id) {
        if (state.active === true) return { ...state, active: false };
        return { ...state, active: true };
      }
      return state;
    });

    setDuoplaneState(updatedDuoplaneState);
  };
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
                    <button onClick={() => dropDown(po.public_reference)}>v</button>
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
                          <tr key={shipment.id} className="flex justify-between">
                            {shipment.partialShipments.map((partialShipment) => (
                              <>
                                <div>
                                  <label htmlFor="">weight</label>
                                  <input className="text-black" type="text" value={partialShipment.weight} />
                                </div>
                                <div>
                                  <label htmlFor="">qty</label>
                                  <input className="text-black" type="text" value={partialShipment.qty} />
                                </div>
                              </>
                            ))}
                          </tr>
                        );
                    })}
                    <button onClick={() => handleClick(po.public_reference, po.shipping_address.first_name, po.shipping_address.address_1)}>
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
