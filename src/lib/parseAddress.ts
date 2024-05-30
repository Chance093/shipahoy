import axios from "axios";
import { env } from "~/env.mjs";
import { type ParsedAddressResponse } from "./definitions";
import { AddressParsingError } from "./customErrors";

export default async function getParsedAddress(address: string) {
  const baseUrl = "https://us-street.api.smarty.com/street-address";

  if (address === "") {
    throw new AddressParsingError("Please fill in the above field");
  }

  const response: ParsedAddressResponse = await axios.get(`${baseUrl}?key=${env.NEXT_PUBLIC_SMARTY_KEY}&license=us-core-cloud&street='${address}'`);
  const formattedAddress = formatResponseAddress(response);

  return formattedAddress;
}

function formatResponseAddress(response: ParsedAddressResponse) {
  if (response.data.length == 0 || response.data[0]?.components === undefined) {
    throw new AddressParsingError("Could not parse address");
  }

  const parsedAddress = response.data[0].components;
  const formattedAddress = {
    address: `${parsedAddress.primary_number} ${parsedAddress.street_name} ${parsedAddress.street_suffix}`,
    addressTwo: `${parsedAddress.secondary_designator ?? ""} ${parsedAddress.secondary_number ?? ""}`,
    zipcode: parsedAddress.zipcode,
    city: parsedAddress.city_name,
    state: parsedAddress.state_abbreviation,
  };

  return formattedAddress;
}
