"use client";
import { useEffect, useState } from "react";
import {
  type PoOrders,
  type Shipment,
  type DuoplaneState,
  type DuoplaneAddress,
  type OrderItems,
  type DuoplaneResponseHeaders,
} from "~/lib/definitions";

export default function useDuoplane(
  data:
    | {
        data: DuoplaneState[];
        headers: DuoplaneResponseHeaders;
      }
    | undefined,
) {
  const [duoplaneState, setDuoplaneState] = useState<DuoplaneState[]>();
  const [poOrders, setPoOrders] = useState<PoOrders>([]);

  useEffect(() => {
    setDuoplaneState(data?.data);
  }, [data]);

  const addShipment = (id: string, address: DuoplaneAddress, orderItems: OrderItems) => {
    const INITIALIZED_SHIPMENT = {
      id: Math.random() * 100000,
      weight: "",
    };

    const poOrderIDs = poOrders.map((poOrder) => poOrder.id);

    // * If PO order is already made, append new shipment to existing shipments
    if (poOrderIDs.includes(id)) {
      const updatedPoOrders = poOrders.map((poOrder) => {
        if (poOrder.id === id) return { ...poOrder, shipments: [...poOrder.shipments, INITIALIZED_SHIPMENT] };
        return poOrder;
      });

      setPoOrders(updatedPoOrders);
    }

    // * If PO order hasn't been made, initialize PO order with new shipment
    else {
      const newPO = {
        id,
        address,
        shipments: [INITIALIZED_SHIPMENT],
        orderItems: orderItems,
      };

      setPoOrders((prev) => [...prev, newPO]);
    }
  };

  const deleteShipment = (poOrderId: string, shipmentId: number) => {
    // * If last shipment is deleted from PO order, delete the whole PO order
    if (poOrders.find((poOrder) => poOrder.id === poOrderId)?.shipments.length === 1) {
      const updatedPoOrders = poOrders.filter((poOrder) => poOrder.id !== poOrderId);
      setPoOrders(updatedPoOrders);
    }

    // * Else, delete just the shipment
    else {
      const updatedPoOrders = poOrders.map((poOrder) => {
        if (poOrder.id === poOrderId) {
          const updatedShipments = poOrder.shipments.filter((shipment) => shipment.id !== shipmentId);
          return { ...poOrder, shipments: updatedShipments };
        }
        return poOrder;
      });

      setPoOrders(updatedPoOrders);
    }
  };

  // * On click, drop down PO orders to show all shipments
  const showShipments = (id: string) => {
    const updatedDuoplaneState = duoplaneState!.map((state) => {
      if (state.public_reference === id) {
        if (state.active === true) return { ...state, active: false };
        return { ...state, active: true };
      }
      return state;
    });

    setDuoplaneState(updatedDuoplaneState);
  };

  const handleWeightChange = (field: Partial<Shipment>, poOrderId: string, shipmentId: number) => {
    const updatedPoOrders = poOrders.map((poOrder) => {
      if (poOrder.id === poOrderId) {
        const updatedShipments = poOrder.shipments.map((shipment) => {
          if (shipment.id === shipmentId) return { ...shipment, ...field };
          return shipment;
        });
        return { ...poOrder, shipments: updatedShipments };
      }
      return poOrder;
    });

    setPoOrders(updatedPoOrders);
  };

  return { duoplaneState, poOrders, addShipment, deleteShipment, showShipments, handleWeightChange };
}
