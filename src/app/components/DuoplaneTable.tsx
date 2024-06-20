"use client";

import useDuoplane from "~/hooks/useDuoplane";
import { type Pricing } from "~/lib/definitions";
import usePagination from "~/hooks/usePagination";
import useDuoplaneSubmission from "~/hooks/useDuoplaneSubmission";
import ShipmentConfirmation from "./DuoplaneShipmentConfirmation";
import DuoplaneOrders from "./DuoplaneOrders";
import { api } from "~/trpc/react";

export default function DuoplaneTable({ pricing }: { pricing: Pricing }) {
  const { data, isLoading } = api.duoplane.getDuoplaneOrders.useQuery();

  const { duoplaneState, poOrders, addShipment, deleteShipment, showShipments, handleWeightChange } = useDuoplane(data);

  const { labelPrices, errorMessage, isConfirmationDisplayed, setIsConfirmationDisplayed, submitDuoplane } = useDuoplaneSubmission(poOrders, pricing);

  const { page, totalPages, incrementPage, decrementPage } = usePagination(3);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (duoplaneState === undefined) return null;

  return (
    <>
      {duoplaneState.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-8">
          <p className="text-2xl">You have no orders!</p>
        </div>
      ) : !isConfirmationDisplayed ? (
        <DuoplaneOrders
          duoplaneState={duoplaneState}
          poOrders={poOrders}
          handleWeightChange={handleWeightChange}
          showShipments={showShipments}
          addShipment={addShipment}
          deleteShipment={deleteShipment}
          submitDuoplane={submitDuoplane}
          errorMessage={errorMessage}
          page={page}
          totalPages={totalPages}
          incrementPage={incrementPage}
          decrementPage={decrementPage}
        />
      ) : (
        <ShipmentConfirmation poOrders={poOrders} labelPrices={labelPrices} setIsConfirmationDisplayed={setIsConfirmationDisplayed} />
      )}
    </>
  );
}
