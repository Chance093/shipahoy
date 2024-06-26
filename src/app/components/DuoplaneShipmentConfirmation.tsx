"use client";
import { ArrowLeftIcon, ArrowUturnUpIcon } from "@heroicons/react/24/solid";
import { Fragment, type Dispatch, type SetStateAction } from "react";
import useDuoplaneShipmentConfirmation from "~/hooks/useDuoplaneShipmentConfirmation";
import { type PoOrders } from "~/lib/definitions";

export default function ShipmentConfirmation({
  poOrders,
  labelPrices,
  setIsConfirmationDisplayed,
  balance,
  errorMessage,
  setErrorMessage,
}: {
  poOrders: PoOrders;
  labelPrices: string[];
  setIsConfirmationDisplayed: Dispatch<SetStateAction<boolean>>;
  balance: number;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}) {
  const { duoplaneError, totalPrice, submitPoOrders } = useDuoplaneShipmentConfirmation(poOrders, setErrorMessage, balance, labelPrices);

  if (duoplaneError) {
    throw duoplaneError;
  }

  let idx = -1;
  return (
    <>
      <h2 className="p-2 text-2xl">Order Confirmation</h2>
      <section className="grid w-full grid-cols-[auto_auto_auto] text-left">
        <h3 className="p-4 pb-6 font-normal">PO ID</h3>
        <h3 className="p-4 pb-6 font-normal">Buyer</h3>
        <h3 className="p-4 pb-6 font-normal">Address</h3>
        {poOrders.map((poOrder) => (
          <Fragment key={poOrder.id}>
            <p className="border-t border-gray-600/50 p-4 py-6">{poOrder.id}</p>
            <p className="border-t border-gray-600/50 p-4 py-6">
              {poOrder.address.first_name} {poOrder.address.last_name}
            </p>
            <p className="border-t border-gray-600/50 p-4 py-6">
              {poOrder.address.address_1}
              {poOrder.address.address_2 ? ", " + poOrder.address.address_2 : ""}, {poOrder.address.city}, {poOrder.address.province}{" "}
              {poOrder.address.post_code}
            </p>
            {poOrder.shipments.map((shipment) => {
              idx += 1;
              return (
                <div key={shipment.id} className="col-span-3 ml-12 flex items-end justify-start gap-8 pb-8">
                  <div>
                    <ArrowUturnUpIcon className="w-6 rotate-90 pb-2 text-gray-600" />
                  </div>
                  <p className="italic">
                    {shipment.weight} lb shipment - ${labelPrices[idx]}
                  </p>
                </div>
              );
            })}
          </Fragment>
        ))}
      </section>
      <div className="ml-4 mt-auto text-red-400">{errorMessage}</div>
      <section className="m-4 flex justify-between">
        <div
          className="flex cursor-pointer items-center gap-4 border-b border-transparent px-2 text-xl hover:border-[#b4a3d8]"
          onClick={() => {
            setIsConfirmationDisplayed(false);
            setErrorMessage("");
          }}
        >
          <ArrowLeftIcon className="w-6" />
          Edit Orders
        </div>
        <button
          className="w-52 cursor-pointer items-start rounded-md bg-purple p-4 text-center disabled:cursor-default disabled:opacity-50"
          disabled={Number(totalPrice) <= 0 || Number(totalPrice) > balance}
          onClick={submitPoOrders}
        >
          Purchase ${totalPrice}
        </button>
      </section>
    </>
  );
}
