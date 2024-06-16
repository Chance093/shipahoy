"use client";

import useDuoplane from "~/hooks/useDuoplane";
import { type DuoplanePO, type Shipments, type PartialShipment, type DuoplaneResponseData, type Pricing } from "~/lib/definitions";
import { ChevronDownIcon, ChevronUpIcon, ArrowUturnUpIcon } from "@heroicons/react/24/solid";
import usePagination from "~/hooks/usePagination";
import Pagination from "./Pagination";
import { type FormEvent, useState, type Dispatch, type SetStateAction } from "react";
import { CostCalculationError, DuoplaneError } from "~/lib/customErrors";

export default function DuoplaneTable({ data, pricing }: { data: DuoplaneResponseData; pricing: Pricing }) {
  const { duoplaneState, shipments, addPartialShipment, deletePartialShipment, showPartialShipments, handlePartialShipmentInputChange } =
    useDuoplane(data);
  const { page, totalPages, incrementPage, decrementPage } = usePagination(3);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmationDisplayed, setIsConfirmationDisplayed] = useState(false);
  const [labelPrices, setLabelPrices] = useState<string[]>([]);

  const submitDuoplane = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      validateShipments(shipments);

      const weights: string[] = [];
      shipments.forEach((shipment) => shipment.partialShipments.forEach((partial) => weights.push(partial.weight)));

      const prices = calculateDuoplaneCost(weights, pricing);
      setLabelPrices(prices);

      setIsConfirmationDisplayed(true);
    } catch (err) {
      if (err instanceof DuoplaneError) {
        setErrorMessage(err.message);
      } else {
        throw err;
      }
    }
  };

  const validateShipments = (shipments: Shipments) => {
    if (shipments.length === 0) throw new DuoplaneError("Please add a shipment.");

    shipments.forEach((shipment) => {
      shipment.partialShipments.forEach((partialShipment) => {
        if (partialShipment.weight === "") throw new DuoplaneError(`PO ${shipment.id}: Empty weight fields must be filled out or deleted.`);
        if (!Number.isInteger(Number(partialShipment.weight)) || Number.isNaN(Number(partialShipment.weight)))
          throw new DuoplaneError(`PO ${shipment.id}: All weight fields must be whole numbers`);

        if (Number(partialShipment.weight) <= 0 || Number(partialShipment.weight) > 70)
          throw new DuoplaneError(`PO ${shipment.id}: All weight fields must be between 0 - 70 lbs.`);
      });
    });
  };

  const calculateDuoplaneCost = (weights: string[], pricing: Pricing) => {
    if (weights.length === 0) throw new CostCalculationError("Could not calculate cost: No weights given.");

    const prices = weights.map((stringWeight) => {
      const weight = Number(stringWeight);
      switch (true) {
        case weight <= 0 || weight > 70: {
          throw new CostCalculationError("Weight must be between 0 and 70");
        }
        case weight <= 3.99:
          return pricing.zeroToFour;
        case weight <= 7.99:
          return pricing.fourToEight;
        case weight <= 14.99:
          return pricing.eightToFifteen;
        case weight <= 24.99:
          return pricing.fifteenToTwentyFive;
        case weight <= 34.99:
          return pricing.twentyFiveToThirtyFive;
        case weight <= 44.99:
          return pricing.thirtyFiveToFortyFive;
        case weight <= 54.99:
          return pricing.fortyFiveToFiftyFive;
        case weight <= 64.99:
          return pricing.fiftyFiveToSixtyFive;
        case weight <= 70:
          return pricing.sixtyFiveToSeventy;
        default:
          throw new CostCalculationError("Invalid weight");
      }
    });

    return prices;
  };

  return (
    <>
      {duoplaneState.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-8">
          <p className="text-2xl">You have no orders!</p>
        </div>
      ) : isConfirmationDisplayed ? (
        <ShipmentConfirmation shipments={shipments} labelPrices={labelPrices} setIsConfirmationDisplayed={setIsConfirmationDisplayed} />
      ) : (
        <>
          <form id="duoplane-form" className="grid w-full grid-cols-[80px_auto_auto_auto] text-left" onSubmit={submitDuoplane}>
            <h3 className="col-start-1 p-4 pb-6 font-normal"></h3>
            <h3 className="col-start-2 p-4 pb-6 font-normal">PO ID</h3>
            <h3 className="col-start-3 p-4 pb-6 font-normal">Buyer</h3>
            <h3 className="col-start-4 p-4 pb-6 font-normal">Address</h3>
            {duoplaneState.map((po) => (
              <PO
                key={po.public_reference}
                po={po}
                shipments={shipments}
                handleChange={handlePartialShipmentInputChange}
                showPartialShipments={showPartialShipments}
                deletePartialShipment={deletePartialShipment}
                addPartialShipment={addPartialShipment}
              />
            ))}
          </form>
          <div className="ml-4 text-red-400">{errorMessage}</div>
          <section className="mt-auto flex justify-between">
            <input
              type="submit"
              form="duoplane-form"
              className="m-4 h-14 w-52 cursor-pointer rounded-md bg-purple p-4 text-center disabled:opacity-50"
            />

            <Pagination page={page} totalPages={totalPages} incrementPage={incrementPage} decrementPage={decrementPage} />
          </section>
        </>
      )}
    </>
  );
}

function PO({
  po,
  shipments,
  handleChange,
  showPartialShipments,
  deletePartialShipment,
  addPartialShipment,
}: {
  po: DuoplanePO;
  shipments: Shipments;
  handleChange: (field: Partial<PartialShipment>, poId: string, partShipId: number) => void;
  showPartialShipments: (id: string) => void;
  deletePartialShipment: (poId: string, partialShipmentId: number) => void;
  addPartialShipment: (id: string, buyer: string, address: string) => void;
}) {
  return (
    <>
      <div className="border-t border-gray-600/50 p-4 py-6" onClick={() => showPartialShipments(po.public_reference)}>
        {po.active ? <ChevronUpIcon className="w-8 cursor-pointer" /> : <ChevronDownIcon className="w-8 cursor-pointer" />}
      </div>
      <p className="border-t border-gray-600/50 p-4 py-6">{po.public_reference}</p>
      <p className="border-t border-gray-600/50 p-4 py-6">
        {po.shipping_address.first_name} {po.shipping_address.last_name}
      </p>
      <p className="border-t border-gray-600/50 p-4 py-6">{po.shipping_address.address_1}</p>
      {po.active && (
        <>
          {shipments.map((shipment) => {
            if (shipment.id === po.public_reference) {
              return shipment.partialShipments.map((partialShipment) => (
                <PartialShipment
                  key={partialShipment.id}
                  handleChange={handleChange}
                  deletePartialShipment={deletePartialShipment}
                  poId={po.public_reference}
                  shipmentId={shipment.id}
                  partialShipment={partialShipment}
                />
              ));
            }
          })}
          <button
            className="col-span-4 mb-6 ml-20 w-40 cursor-pointer rounded-md bg-[#b4a3d8] p-1 text-black"
            onClick={() => addPartialShipment(po.public_reference, po.shipping_address.first_name, po.shipping_address.address_1)}
            type="button"
          >
            Add Shipment
          </button>
        </>
      )}
    </>
  );
}

function PartialShipment({
  handleChange,
  deletePartialShipment,
  poId,
  shipmentId,
  partialShipment,
}: {
  handleChange: (field: Partial<PartialShipment>, poId: string, partShipId: number) => void;
  deletePartialShipment: (poId: string, partialShipmentId: number) => void;
  poId: string;
  shipmentId: string;
  partialShipment: PartialShipment;
}) {
  return (
    <>
      <div></div>
      <div className="cols-start-2 col-span-3 flex items-end justify-start gap-8 pb-8">
        <div>
          <ArrowUturnUpIcon className="w-6 rotate-90 pb-4 text-gray-600" />
        </div>
        <input
          onChange={(e) => handleChange({ weight: e.target.value }, shipmentId, partialShipment.id)}
          className="border-b border-gray-600/50 bg-black bg-opacity-0 p-2 placeholder:italic focus:outline-none"
          type="text"
          value={partialShipment.weight}
          placeholder="weight (lbs)"
          required
        />
        <div className="cursor-pointer" onClick={() => deletePartialShipment(poId, partialShipment.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </div>
    </>
  );
}

function ShipmentConfirmation({
  shipments,
  labelPrices,
  setIsConfirmationDisplayed,
}: {
  shipments: Shipments;
  labelPrices: string[];
  setIsConfirmationDisplayed: Dispatch<SetStateAction<boolean>>;
}) {
  let labelPriceIdx = -1;
  return (
    <>
      <section className="grid w-full grid-cols-[auto_auto_auto] text-left">
        <h3 className="p-4 pb-6 font-normal">PO ID</h3>
        <h3 className="p-4 pb-6 font-normal">Buyer</h3>
        <h3 className="p-4 pb-6 font-normal">Address</h3>
        {shipments.map((shipment) => (
          <>
            <p className="border-t border-gray-600/50 p-4 py-6">{shipment.id}</p>
            <p className="border-t border-gray-600/50 p-4 py-6">{shipment.buyer}</p>
            <p className="border-t border-gray-600/50 p-4 py-6">{shipment.address}</p>
            {shipment.partialShipments.map((partialShipment) => {
              labelPriceIdx += 1;
              return (
                <div key={partialShipment.id} className="col-span-3 ml-8 flex items-end justify-start gap-8 pb-8">
                  <div>
                    <ArrowUturnUpIcon className="w-6 rotate-90 pb-4 text-gray-600" />
                  </div>
                  <p>
                    {partialShipment.weight} lb shipment - ${labelPrices[labelPriceIdx]}
                  </p>
                </div>
              );
            })}
          </>
        ))}
      </section>
      <section className="flex justify-between">
        <button onClick={() => setIsConfirmationDisplayed(false)}>Edit Orders</button>
        <button>${labelPrices.reduce((a, b) => Number(a) + Number(b), 0)}</button>
      </section>
    </>
  );
}
