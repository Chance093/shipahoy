"use client";
import { useState } from "react";
import getParsedAddress from "~/lib/parseAddress";
import { AddressParsingError } from "~/lib/customErrors";
import * as Sentry from "@sentry/nextjs";
import { type HandleChange } from "~/lib/definitions";
import { AxiosError } from "axios";

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
      // * If error was from smarty request
      if (err instanceof AxiosError) {
        // * The request was made and the server responded with a status code
        if (err.response) {
          if (err.response.status === 429) setParsingErrorMessage("Request Limit Reached - Please try again later.");
          else {
            Sentry.captureException(err);
            setParsingErrorMessage("Could not parse address");
          }
        }

        // * The request was made but no response was received
        else if (err.request) {
          setParsingErrorMessage("Smarty Connection Error - Response not found.");
        }

        // * Something happened in setting up the request that triggered an error
        else {
          Sentry.captureException(err);
          setParsingErrorMessage("Could not parse address");
        }
      }

      // * If custom address parsing error, show to user
      else if (err instanceof AddressParsingError) {
        setParsingErrorMessage(err.message);
      }

      // * Catch all error
      else {
        Sentry.captureException(err);
        setParsingErrorMessage("Could not parse address");
      }
    }
  };

  return { pastedAddress, setPastedAddress, parsingErrorMessage, parseAddress };
}
