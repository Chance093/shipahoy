"use client";
import { ArrowLeftIcon, ArrowUturnUpIcon } from "@heroicons/react/24/solid";
import { Fragment, type Dispatch, type SetStateAction } from "react";
import { type PoOrders } from "~/lib/definitions";

export default function ShipmentConfirmation({
  poOrders,
  labelPrices,
  setIsConfirmationDisplayed,
  balance,
}: {
  poOrders: PoOrders;
  labelPrices: string[];
  setIsConfirmationDisplayed: Dispatch<SetStateAction<boolean>>;
  balance: number;
}) {
  const totalPrice = labelPrices.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
  const submitPoOrders = () => {
    // Disable button if $0
    // Throw error if balance isn't high enough
    if (Number(totalPrice) > balance) throw new Error("Insufficient balance");
    // Post to weship
    // Post to db
    // * Use create labels and store data functions in useCreateLabels() hook
    // * Update error handling for functions
    // * Create default from address
    // Post to duoplane
    // Update balance
    // Redirect to home page
  };

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
      <section className="m-4 mt-auto flex justify-between">
        <div
          className="flex cursor-pointer items-center gap-4 border-b border-transparent px-2 text-xl hover:border-[#b4a3d8]"
          onClick={() => setIsConfirmationDisplayed(false)}
        >
          <ArrowLeftIcon className="w-6" />
          Edit Orders
        </div>
        <button className="w-52 cursor-pointer items-start rounded-md bg-purple p-4 text-center disabled:opacity-50">Purchase ${}</button>
      </section>
    </>
  );
}
