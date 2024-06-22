"use client";

import useDuoplane from "~/hooks/useDuoplane";
import { type Pricing } from "~/lib/definitions";
import usePagination from "~/hooks/usePagination";
import useDuoplaneSubmission from "~/hooks/useDuoplaneSubmission";
import ShipmentConfirmation from "./DuoplaneShipmentConfirmation";
import DuoplaneOrders from "./DuoplaneOrders";
import { api } from "~/trpc/react";
import * as Sentry from "@sentry/nextjs";
import { DuoplaneAxiosRedirectError } from "~/lib/customErrors";

export default function DuoplaneTable({ pricing }: { pricing: Pricing }) {
  const { data, isLoading, isError, error } = api.duoplane.getDuoplaneOrders.useQuery(undefined, { retry: 2 });
  const { duoplaneState, poOrders, addShipment, deleteShipment, showShipments, handleWeightChange } = useDuoplane(data);
  const { labelPrices, errorMessage, isConfirmationDisplayed, setIsConfirmationDisplayed, submitDuoplane } = useDuoplaneSubmission(poOrders, pricing);
  const duoplaneTotalCount = data?.headers["duoplane-total-count"] ? Number(data.headers["duoplane-total-count"]) : 1;
  const { page, totalPages, incrementPage, decrementPage } = usePagination(duoplaneTotalCount, 20);

  if (isLoading) {
    return (
      <>
        <h2 className="p-2 text-2xl">Duoplane Orders</h2>
        <section className="flex flex-1 items-center justify-center">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </section>
      </>
    );
  }

  if (isError) {
    if (error.data?.code === "UNAUTHORIZED") {
      // * If type "UNAUTHORIZED", show the error directly on DuoplaneTable
      Sentry.captureException(error);
      return (
        <>
          <h2 className="p-2 text-2xl">Duoplane Orders</h2>
          <div className="flex flex-1 flex-col items-center justify-center text-xl text-red-400">
            <p>{error.message}</p>
          </div>
        </>
      );
    } else if (error.data?.code === "CONFLICT") {
      // * If any other error type, redirect to error page
      throw new DuoplaneAxiosRedirectError(error.message);
    }
    throw error;
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
