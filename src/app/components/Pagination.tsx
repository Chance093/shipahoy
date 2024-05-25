"use client";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function Pagination({
  page,
  decrementPage,
  incrementPage,
  totalPages,
}: {
  page: number;
  decrementPage: () => void;
  incrementPage: () => void;
  totalPages: number;
}) {
  const leftButtonDisabled = page === 1 ? "opacity-50" : "cursor-pointer";
  const rightButtonDisabled = page === totalPages ? "opacity-50" : "cursor-pointer";

  return (
    <div className="m-4 mr-12 flex items-center gap-4 self-end justify-self-end rounded-lg border border-purple">
      <div className={`rounded-l-lg ${leftButtonDisabled} bg-purple p-2`} onClick={decrementPage}>
        <ArrowLeftIcon className="w-6" />
      </div>
      <div className="text-xl">
        {page} of {totalPages}
      </div>
      <div className={`rounded-r-lg ${rightButtonDisabled} bg-purple p-2`} onClick={incrementPage}>
        <ArrowRightIcon className="w-6" />
      </div>
    </div>
  );
}
