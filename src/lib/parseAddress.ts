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

  console.log(response.data[0].components);

  const parsedAddress = response.data[0].components;
  const primaryNumber = parsedAddress.primary_number ? parsedAddress.primary_number + " " : "";
  const streetPredirection = parsedAddress.street_predirection ? parsedAddress.street_predirection + " " : "";
  const streetName = parsedAddress.street_name ? parsedAddress.street_name + " " : "";
  const streetSuffix = parsedAddress.street_suffix ? parsedAddress.street_suffix + " " : "";
  const secondaryDesignator = parsedAddress.secondary_designator ? parsedAddress.secondary_designator + " " : "";
  const secondaryNumber = parsedAddress.secondary_number ? parsedAddress.secondary_number + " " : "";
  const zipCode = parsedAddress.zipcode ? parsedAddress.zipcode : "";
  const cityName = parsedAddress.city_name ? parsedAddress.city_name : "";
  const stateAbbreviation = parsedAddress.state_abbreviation ? parsedAddress.state_abbreviation : "";

  const formattedAddress = {
    address: `${primaryNumber}${streetPredirection}${streetName}${streetSuffix}`,
    addressTwo: `${secondaryDesignator}${secondaryNumber}`,
    zipcode: zipCode,
    city: cityName,
    state: stateAbbreviation,
  };

  return formattedAddress;
}
