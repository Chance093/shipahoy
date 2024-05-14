"use client"; // Error components must be Client Components

import { FaceFrownIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8">
      <FaceFrownIcon className=" w-40 text-light-purple" />
      <h2 className="text-4xl">It looks like something went wrong!</h2>
      <p>Please contact us or click the button below to try again.</p>
      <p className="text-red-400">
        {error.name} - {error.message}
      </p>
      <button
        className="w-48 cursor-pointer rounded-md bg-purple p-4 text-center"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </section>
  );
}
