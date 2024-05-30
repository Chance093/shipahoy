import axios from "axios";
import { env } from "~/env.mjs";
import { type FormattedAddress, type ParsedAddressResponse } from "./definitions";

export default async function getParsedAddress(address: string): Promise<FormattedAddress | undefined> {
  const baseUrl = "https://us-street.api.smarty.com/street-address";
  try {
    const response: ParsedAddressResponse = await axios.get(`${baseUrl}?key=${env.NEXT_PUBLIC_SMARTY_KEY}&license=us-core-cloud&street='${address}'`);
    const formattedAddress = formatResponseAddress(response);

    return formattedAddress;
  } catch (err) {
    throw err;
  }
}

function formatResponseAddress(response: ParsedAddressResponse) {
  if (response.data.length == 0 || response.data[0]?.components === undefined) {
    throw new Error("Could not parse address");
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
