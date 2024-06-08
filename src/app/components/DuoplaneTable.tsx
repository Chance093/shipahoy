"use client";

import { useState } from "react";
import { type PartialShipment, type Shipments, type duoplaneResponseData } from "~/lib/definitions";

export default function DuoplaneTable({ data }: { data: duoplaneResponseData }) {
  const duoplaneData = data.map((data) => ({ ...data, active: false }));
  const [duoplaneState, setDuoplaneState] = useState(duoplaneData);
  const [shipments, setShipments] = useState<Shipments>([]);
  const handleClick = (id: string, buyer: string, address: string) => {
    // Check if PO is already is shipments
    // If it is, add new partial shipment to existing state
    // If not, initialize new shipment
    const shipIds = shipments.map((ship) => ship!.id);
    const newPartialShipment = {
      id: Math.random() * 100000,
      weight: "",
      qty: 0,
    };
    if (shipIds.includes(id)) {
      const newPartialShipments = shipments.map((ship) => {
        if (ship === undefined) throw new Error("undefined");
        if (ship.id === id) return { ...ship, partialShipments: [...ship.partialShipments, newPartialShipment] };
        return ship;
      });
      setShipments(newPartialShipments);
    } else {
      const newPO = {
        id,
        buyer,
        address,
        partialShipments: [newPartialShipment],
      };
      setShipments((prev) => [...prev, newPO]);
    }
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

  const handleChange = (fields: Partial<PartialShipment>, poId: string, partShipId: number) => {
    const updatedShipments = shipments.map((po) => {
      if (po === undefined) throw new Error("PO is undefined");
      if (po.id === poId) {
        const partialShip = po?.partialShipments.map((partialShip) => {
          if (partialShip.id === partShipId) return { ...partialShip, ...fields };
          return partialShip;
        });
        return { ...po, partialShipments: partialShip };
      }
      return po;
    });

    setShipments(updatedShipments);
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
                          <tr key={shipment.id} className="flex flex-col justify-between">
                            {shipment.partialShipments.map((partialShipment) => (
                              <>
                                <div className="flex gap-4">
                                  <label htmlFor="">weight</label>
                                  <input
                                    onChange={(e) => handleChange({ weight: e.target.value }, shipment.id, partialShipment.id)}
                                    className="text-black"
                                    type="text"
                                    value={partialShipment.weight}
                                  />
                                </div>
                                <div className="flex gap-4">
                                  <label htmlFor="">qty</label>
                                  <input
                                    onChange={(e) => handleChange({ qty: Number(e.target.value) }, shipment.id, partialShipment.id)}
                                    className="text-black"
                                    type="text"
                                    value={partialShipment.qty}
                                  />
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
