"use client";

import { useState } from "react";
import { type Shipments, type duoplaneResponseData } from "~/lib/definitions";

export default function DuoplaneTable({ duoplaneData }: { duoplaneData: duoplaneResponseData }) {
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
  return (
    <>
      {duoplaneData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-8">
          <p className="text-2xl">You have no orders!</p>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead className="text-custom-gray ">
            <tr className="border-b border-gray-600/50">
              <th className="p-4 pb-6 font-normal">Add Shipment</th>
              <th className="p-4 pb-6 font-normal">PO ID</th>
              <th className="p-4 pb-6 font-normal">Buyer</th>
              <th className="p-4 pb-6 font-normal">Address</th>
            </tr>
          </thead>
          <tbody>
            {duoplaneData.map((po) => (
              <>
                <tr key={po.public_reference} className="border-b border-gray-600/50">
                  <td className="p-4 py-6">
                    <button onClick={() => handleClick(po.public_reference, po.shipping_address.first_name, po.shipping_address.address_1)}>+</button>
                  </td>
                  <td className="p-4 py-6">{po.public_reference}</td>
                  <td className="p-4 py-6">
                    {po.shipping_address.first_name} {po.shipping_address.last_name}
                  </td>
                  <td className="p-4 py-6">{po.shipping_address.address_1}</td>
                </tr>
                {shipments.map((shipment, idx) => {
                  if (shipment?.id === po.public_reference)
                    return (
                      <tr key={idx} className="flex justify-between">
                        <p>weight: {shipment?.partialShipments[idx]?.weight}</p>
                        <p>qty: {shipment?.partialShipments[idx]?.qty}</p>
                      </tr>
                    );
                })}
              </>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
