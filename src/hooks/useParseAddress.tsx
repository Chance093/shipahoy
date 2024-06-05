"use client";
import { useState } from "react";
import getParsedAddress from "~/lib/parseAddress";
import { AddressParsingError } from "~/lib/customErrors";
import * as Sentry from "@sentry/nextjs";
import { type HandleChange } from "~/lib/definitions";

export default function useParseAddress(handleChange: HandleChange, label: "From" | "To") {
  const [pastedAddress, setPastedAddress] = useState("");
  const [parsingErrorMessage, setParsingErrorMessage] = useState("");

  const parseAddress = async (address: string) => {
    try {
      const formattedAddress = await getParsedAddress(address);
      console.log(formattedAddress);

      if (label === "From") {
        handleChange({
          FromStreet: formattedAddress.address,
          FromStreet2: formattedAddress.addressTwo === " " ? "" : formattedAddress.addressTwo,
          FromCity: formattedAddress.city,
          FromState: formattedAddress.state,
          FromZip: formattedAddress.zipcode,
        });
      } else if (label === "To") {
        handleChange({
          ToStreet: formattedAddress.address,
          ToStreet2: formattedAddress.addressTwo === " " ? "" : formattedAddress.addressTwo,
          ToCity: formattedAddress.city,
          ToState: formattedAddress.state,
          ToZip: formattedAddress.zipcode,
        });
      }

      setPastedAddress("");
      setParsingErrorMessage("");
    } catch (err) {
      /**
       * * If error originated from bad request to smarty API, forward to sentry
       * * Otherwise just show the user a parsing error
       */
      if (err instanceof AddressParsingError) {
        setParsingErrorMessage(err.message);
      } else {
        Sentry.captureException(err);
        setParsingErrorMessage("Could not parse address");
      }
    }
  };

  return { pastedAddress, setPastedAddress, parsingErrorMessage, parseAddress };
}
