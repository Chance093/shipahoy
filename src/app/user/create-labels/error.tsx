"use client"; // Error components must be Client Components

import { FaceFrownIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { LabelCreationError, RedirectError } from "~/lib/customErrors";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  const displayedError = () => {
    if (error instanceof LabelCreationError || error instanceof RedirectError) {
      return <p className="pb-4 text-xl text-red-400">{error.message}</p>;
    }
  };

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8">
      <FaceFrownIcon className=" w-40 text-light-purple" />
      <h2 className="text-4xl">It looks like something went wrong!</h2>
      {displayedError()}
      <p>Please contact us or click the button below to try again.</p>
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
