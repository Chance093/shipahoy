import axios from "axios";
import { type Links, type ResponseData, type Payload } from "~/lib/definitions";
import { env } from "~/env.mjs";

type LabelRequest = {
  key: string;
  orderNumber: string;
  shipFrom: ShippingAddress;
  shipTo: ShippingAddress;
  weight: number;
};

type ShippingAddress = {
  name: string;
  company: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
  country: "US";
  phone: string;
};

type ErrorMessage = {
  error: string;
};

type InvalidProperties = {
  orderNumber: string | null;
  shipFrom: string[];
  shipTo: string[];
  weight: string | null;
};

// * Function to return error code and message to client
const handleRequestError = (errorMessage: ErrorMessage, code: number) => {
  const responseBody = JSON.stringify(errorMessage);
  const errorParams = { status: code, "Content-Type": "application/json" };
  return new Response(responseBody, errorParams);
};

// * Checks for empty values in payload addresses
const validateShipment = (fields: ShippingAddress, errorArray: string[]) => {
  const { name, street1, city, state, postalCode, country, phone } = fields;
  if (!name) errorArray.push("name");
  if (!street1) errorArray.push("street1");
  if (!city) errorArray.push("city");
  if (!state) errorArray.push("state");
  if (!postalCode) errorArray.push("postalCode");
  if (country?.toLocaleLowerCase() !== "us") errorArray.push("country");
  if (!phone) errorArray.push("phone");
};

// * Returns an array of invalid properties to be sent to the client
const getInvalidProperties = (data: LabelRequest) => {
  const invalidProperties: InvalidProperties = {
    orderNumber: null,
    shipFrom: [],
    shipTo: [],
    weight: null,
  };
  const { orderNumber, shipFrom, shipTo, weight: weightProperty } = data;

  // * If order number missing, set invalid order number property
  if (!orderNumber) {
    const templateLiteral = `${typeof orderNumber === "string" ? "an empty string" : void orderNumber}`;
    invalidProperties.orderNumber = `orderNumber is required; instead received ${templateLiteral}`;
  }

  // * Set invalid weight property
  const weight = Number(weightProperty);
  switch (true) {
    case isNaN(weight): {
      invalidProperties.weight = "weight should be a number";
      break;
    }
    case !weight && weight !== 0: {
      invalidProperties.weight = "weight is required";
      break;
    }
    case weight < 1 || weight > 70: {
      invalidProperties.weight = `weight should be between 1-70; instead received ${weight}`;
      break;
    }
  }

  // * Set invalid address properties
  validateShipment(shipFrom, invalidProperties.shipFrom);
  validateShipment(shipTo, invalidProperties.shipTo);

  return invalidProperties;
};

// * Take invalid props and make it a readable message
const processInvalidProperties = (invalidProperties: InvalidProperties) => {
  const { orderNumber, shipFrom, shipTo, weight } = invalidProperties;
  const errors: string[] = [];
  if (orderNumber) errors.push(orderNumber);
  if (weight) errors.push(weight);
  if (shipFrom.length) errors.push(`Invalid properties of shipFrom: ${shipFrom.join(", ")}`);
  if (shipTo.length) errors.push(`Invalid properties of shipTo: ${shipTo.join(", ")}`);
  if (!errors.length) return void 0;
  let message = "Invalid properties:";
  for (let x = 0; x < errors.length; ++x) message = `${message}\n${x + 1}. ${errors[x]}`;
  return handleRequestError({ error: message }, 400);
};

// * Converts payload to weship friendly payload
const convertDataToPayload = (data: LabelRequest) => {
  const { shipFrom, shipTo, weight } = data;
  const payload = {
    labelType: "priority",
    ToName: shipTo.name,
    ToCompany: shipTo.company,
    ToStreet: shipTo.street1,
    ToStreet2: shipTo.street2,
    ToCity: shipTo.city,
    ToZip: shipTo.postalCode,
    ToState: shipTo.state,
    ToPhone: shipTo.phone,
    FromName: shipFrom.name,
    FromCompany: shipTo.company,
    FromStreet: shipTo.street1,
    FromStreet2: shipTo.street2,
    FromCity: shipTo.city,
    FromZip: shipTo.postalCode,
    FromState: shipTo.state,
    FromPhone: shipTo.phone,
    Weight: weight.toString(),
    Length: "18",
    Height: "18",
    Width: "18",
  };
  return payload;
};

async function createLabels(payload: Payload[]) {
  const url = "https://api.weshipsmart.com/api/v2/order/create-bulk-order";
  const data = {
    labelType: "priority",
    data: payload,
  };
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.NEXT_PUBLIC_MOKA_KEY,
    },
    body: JSON.stringify(data),
  };

  // * Create labels with weship
  const { data: responseData }: { data: ResponseData } = await axios.post(url, data, config);
  const bulkOrder = responseData.bulkOrder;
  const orders = bulkOrder.orders;

  // * Grab all tracking numbers from weship
  const tracking = [];
  for (const order of orders) {
    const trackingNumber = order.tracking;
    tracking.push(trackingNumber);
  }

  // * Grab all links from weship
  const links: Links = {
    pdf: bulkOrder.pdfLink,
    csv: bulkOrder.csvLink,
    zip: bulkOrder.zipLink,
  };

  return { links, tracking };
}

export const POST = async (request: Request) => {
  // * Capture client payload
  const data = (await request.json()) as LabelRequest;

  // * Validate client key
  // TODO: Pass key as basic authentication (better security)
  const { key } = data;
  if (key !== "abcxyz") return handleRequestError({ error: "Invalid key" }, 403);
  // TODO: Get userid from db using key

  // * Validate payload
  const invalidProperties = getInvalidProperties(data);
  const validationResults = processInvalidProperties(invalidProperties);
  if (validationResults instanceof Response) return validationResults;

  const payload = convertDataToPayload(data);
  // TODO: Create labels with this payload
  // * Send post request to weship (build another weship request function)
  const { tracking, links } = await createLabels([payload]);
  // * Take tracking and links and upload to our db
  // * Update order and label counts for user
  // * Update balance
  // * Return tracking to client
};

// post localhost:3000/api/temp '{"key": "abcxyz", "orderNumber": "000140500-2", "shipFrom": { "name": "fulfillment center", "company": "fulfillment center", "street1": "3395 s. jones blvd.", "street2": "pmb#180", "city": "las vegas", "state": "nv", "postalCode": "89146", "country": "us", "phone": "8005008486" }, "shipTo": { "name": "jessica grantham", "company": "", "street1": "927 n queen st", "street2": "", "city": "martinsburg", "state": "wv", "postalCode": "25404-3544", "country": "us", "phone": "3049010284" }, "weight": 4 }'
// post 127.0.0.1:3000/api/temp '{"key": "abcxyz", "orderNumber": "", "shipFrom": { "name": "fulfillment center", "company": "fulfillment center", "street1": "", "street2": "pmb#180", "city": "las vegas", "state": "", "postalCode": "89146", "country": "", "phone": "8005008486" }, "shipTo": { "name": "", "company": "", "street1": "927 n queen st", "street2": "", "city": "martinsburg", "state": "wv", "postalCode": "25404-3544", "country": "us", "phone": "3049010284" }, "weight": 0 }'
