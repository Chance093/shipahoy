"use client";
import { useState } from "react";
import { type Shipments, type duoplaneResponseData, type PartialShipment } from "~/lib/definitions";

export default function useDuoplane(data: duoplaneResponseData) {
  const duoplaneData = data.map((data) => ({ ...data, active: false }));

  const [duoplaneState, setDuoplaneState] = useState(duoplaneData);
  const [shipments, setShipments] = useState<Shipments>([]);

  const addPartialShipment = (id: string, buyer: string, address: string) => {
    const INITIALIZED_PARTIAL_SHIPMENT = {
      id: Math.random() * 100000,
      weight: "",
      qty: "",
    };

    const shipmentIds = shipments.map((ship) => ship.id);

    // * If shipment is already made, append new partial shipment to existing partial shipments
    if (shipmentIds.includes(id)) {
      const updatedPartialShipments = shipments.map((ship) => {
        if (ship.id === id) return { ...ship, partialShipments: [...ship.partialShipments, INITIALIZED_PARTIAL_SHIPMENT] };
        return ship;
      });

      setShipments(updatedPartialShipments);
    }

    // * If shipment hasn't been made, initialize shipment with new partial shipment
    else {
      const newPO = {
        id,
        buyer,
        address,
        partialShipments: [INITIALIZED_PARTIAL_SHIPMENT],
      };

      setShipments((prev) => [...prev, newPO]);
    }
  };

  // TODO: if last partial shipment is deleted, delete the PO from shipments state
  const deletePartialShipment = (poId: string, partialShipmentId: number) => {
    const updatedShipments = shipments.map((po) => {
      if (po.id === poId) {
        const partialShipment = po.partialShipments.filter((partialShipment) => partialShipment.id !== partialShipmentId);
        return { ...po, partialShipments: partialShipment };
      }
      return po;
    });

    setShipments(updatedShipments);
  };

  const showPartialShipments = (id: string) => {
    const updatedDuoplaneState = duoplaneState.map((state) => {
      if (state.public_reference === id) {
        if (state.active === true) return { ...state, active: false };
        return { ...state, active: true };
      }
      return state;
    });

    setDuoplaneState(updatedDuoplaneState);
  };

  const handlePartialShipmentInputChange = (field: Partial<PartialShipment>, poId: string, partShipId: number) => {
    const updatedShipments = shipments.map((po) => {
      if (po.id === poId) {
        const partialShip = po.partialShipments.map((partialShip) => {
          if (partialShip.id === partShipId) return { ...partialShip, ...field };
          return partialShip;
        });
        return { ...po, partialShipments: partialShip };
      }
      return po;
    });

    setShipments(updatedShipments);
  };

  return { duoplaneState, shipments, addPartialShipment, deletePartialShipment, showPartialShipments, handlePartialShipmentInputChange };
}
