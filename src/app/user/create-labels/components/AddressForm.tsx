import { formInputs, statesList } from "~/lib/lists";
import { type FormData, type HandleChange } from "~/lib/definitions";
import { useState } from "react";
import getParsedAddress from "~/lib/parseAddress";
import { AddressParsingError } from "~/lib/customErrors";
import * as Sentry from "@sentry/nextjs";

export default function AddressForm({ formData, handleChange, label }: { formData: FormData; handleChange: HandleChange; label: string }) {
  const [pastedAddress, setPastedAddress] = useState("");
  const [parsingErrorMessage, setParsingErrorMessage] = useState("");

  const parseAddress = async (address: string) => {
    try {
      const formattedAddress = await getParsedAddress(address);

      if (label === "From") {
        handleChange({
          FromStreet: formattedAddress.address,
          FromAddress: formattedAddress.addressTwo === " " ? "" : formattedAddress.addressTwo,
          FromCity: formattedAddress.city,
          FromState: formattedAddress.state,
          FromZip: formattedAddress.zipcode,
        });
      } else if (label === "To") {
        handleChange({
          ToStreet: formattedAddress.address,
          ToAddress: formattedAddress.addressTwo === " " ? "" : formattedAddress.addressTwo,
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

  return (
    <section className="rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
        <h2 className="text-center text-2xl">{label}</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="paste-address">Paste Full Address</label>
          <input
            type="text"
            id="paste-address"
            onChange={(e) => setPastedAddress(e.target.value)}
            value={pastedAddress}
            className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
            autoComplete="off"
          />
          {parsingErrorMessage !== "" ? <p className="text-red-400">{parsingErrorMessage}</p> : null}
        </div>
        <button
          onClick={() => parseAddress(pastedAddress)}
          className="w-40 cursor-pointer self-start rounded-md bg-[#b4a3d8] p-4 text-center text-black disabled:opacity-50"
        >
          Parse Address
        </button>

        {formInputs.map((input, idx) => {
          if (label === "From") {
            if (idx > 8) return;
          }
          if (label === "To") {
            if (idx <= 8 || idx >= 18) return;
          }
          if (input.selectInput)
            return (
              <div className="flex flex-col gap-2" key={input.id}>
                <label htmlFor={input.property}>{input.label}</label>
                <select
                  id={input.property}
                  onChange={(e) => handleChange({ [input.property]: e.target.value })}
                  className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  required={input.required}
                >
                  {statesList.map((state, idx) => {
                    return (
                      <option
                        value={state.abbreviation}
                        selected={formData[input.property] === state.abbreviation}
                        key={idx}
                        className="border-gray-600/50 bg-[#1a1a1b]"
                      >
                        {state.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          else
            return (
              <div className="flex flex-col gap-2" key={input.id}>
                <label htmlFor={input.property}>{input.label}</label>
                <input
                  type="text"
                  id={input.property}
                  onChange={(e) => handleChange({ [input.property]: e.target.value })}
                  value={formData[input.property as keyof typeof formData]}
                  className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                  required={input.required}
                  pattern={input.regEx}
                  autoComplete="off"
                  readOnly={input.readOnly}
                />
              </div>
            );
        })}
      </div>
    </section>
  );
}
