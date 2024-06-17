"use client";

import useDuoplane from "~/hooks/useDuoplane";
import { type DuoplaneResponseData, type Pricing } from "~/lib/definitions";
import usePagination from "~/hooks/usePagination";
import useDuoplaneSubmission from "~/hooks/useDuoplaneSubmission";
import ShipmentConfirmation from "./DuoplaneShipmentConfirmation";
import DuoplaneOrders from "./DuoplaneOrders";

export default function DuoplaneTable({ data, pricing }: { data: DuoplaneResponseData; pricing: Pricing }) {
  const { duoplaneState, shipments, addPartialShipment, deletePartialShipment, showPartialShipments, handlePartialShipmentInputChange } =
    useDuoplane(data);

  const { labelPrices, errorMessage, isConfirmationDisplayed, setIsConfirmationDisplayed, submitDuoplane } = useDuoplaneSubmission(
    shipments,
    pricing,
  );

  const { page, totalPages, incrementPage, decrementPage } = usePagination(3);

  return (
    <>
      {duoplaneState.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-8">
          <p className="text-2xl">You have no orders!</p>
        </div>
      ) : isConfirmationDisplayed ? (
        <ShipmentConfirmation shipments={shipments} labelPrices={labelPrices} setIsConfirmationDisplayed={setIsConfirmationDisplayed} />
      ) : (
        <DuoplaneOrders
          duoplaneState={duoplaneState}
          shipments={shipments}
          handlePartialShipmentInputChange={handlePartialShipmentInputChange}
          showPartialShipments={showPartialShipments}
          addPartialShipment={addPartialShipment}
          deletePartialShipment={deletePartialShipment}
          submitDuoplane={submitDuoplane}
          errorMessage={errorMessage}
          page={page}
          totalPages={totalPages}
          incrementPage={incrementPage}
          decrementPage={decrementPage}
        />
      )}
    </>
  );
}
