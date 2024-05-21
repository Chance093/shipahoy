"use client";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function Pagination({ page, decrementPage, incrementPage }: { page: number; decrementPage: () => void; incrementPage: () => void }) {
  return (
    <div className="m-4 mr-12 flex items-center gap-4 self-end justify-self-end rounded-lg border border-purple">
      <div className="cursor-pointer rounded-l-lg bg-purple p-2">
        <ArrowLeftIcon className="w-6 " onClick={decrementPage} />
      </div>
      <div className="text-xl">{page}</div>
      <div className="cursor-pointer rounded-r-lg bg-purple p-2">
        <ArrowRightIcon className="w-6 " onClick={incrementPage} />
      </div>
    </div>
  );
}
