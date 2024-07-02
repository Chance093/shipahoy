import { api } from "~/trpc/server";

interface LabelRequest {
  "key": string;
  "orderNumber": string;
  "shipFrom": {
    "name": string;
    "company": string;
    "street1": string;
    "street2": string;
    "city": string;
    "state": string;
    "postalCode": string;
    "country": 'US';
    "phone": string;
  }
  "shipTo": {
    "name": string;
    "company": string;
    "street1": string;
    "street2": string;
    "city": string;
    "state": string;
    "postalCode": string;
    "country": 'US';
    "phone": string;
  },
  "weight": number;
}

interface ErrorMessage {
  error: string;
}

interface InvalidProperties {
  orderNumber: string | null,
  shipFrom: string[];
  shipTo: string[];
  weight: string | null;
}

const handleRequestError = (errorMessage: ErrorMessage, code: number) => {
  const responseBody = JSON.stringify(errorMessage);
  const errorParams = { status: code, 'Content-Type': 'application/json' };
  return new Response(responseBody, errorParams);
}

const validateShipment = (fields: Record<string, string>, errorArray: string[]) => {
  const { name, street1, city, state, postalCode, country, phone } = fields;
  if (!name) errorArray.push("name");
  if (!street1) errorArray.push("street1");
  if (!city) errorArray.push("city");
  if (!state) errorArray.push("state");
  if (!postalCode) errorArray.push("postalCode");
  if (country?.toLocaleLowerCase() !== 'us') errorArray.push("country");
  if (!phone) errorArray.push("phone");
}

const getInvalidProperties = (data: LabelRequest) => {
  const invalidProperties: InvalidProperties = {
    orderNumber: null,
    shipFrom: [],
    shipTo: [],
    weight: null
  };
  const { orderNumber, shipFrom, shipTo, weight: weightProperty } = data;
  if (!orderNumber) {
    const templateLiteral = `${typeof orderNumber === 'string' ? 'an empty string' : void orderNumber}`;
    invalidProperties.orderNumber = `orderNumber is required; instead received ${templateLiteral}`;
  }
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
  validateShipment(shipFrom, invalidProperties.shipFrom);
  validateShipment(shipTo, invalidProperties.shipTo);
  return invalidProperties;
}

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
}

const convertDataToPayload = (data: LabelRequest) => {
  const { shipFrom, shipTo, weight } = data;
  const payload = {
    'labelType': 'priority',
    'ToName': shipTo.name,
    'ToCompany': shipTo.company,
    'ToStreet': shipTo.street1,
    'ToStreet2': shipTo.street2,
    'ToCity': shipTo.city,
    'ToZip': shipTo.postalCode,
    'ToState': shipTo.state,
    'ToPhone': shipTo.phone,
    'FromName': shipFrom.name,
    'FromCompany': shipTo.company,
    'FromStreet': shipTo.street1,
    'FromStreet2': shipTo.street2,
    'FromCity': shipTo.city,
    'FromZip': shipTo.postalCode,
    'FromState': shipTo.state,
    'FromPhone': shipTo.phone,
    'Weight': weight,
    'Length': '',
    'Height': '',
    'Width': '',
  }
  return payload;
}

export const POST = async (request: Request) => {
  const data = await request.json() as LabelRequest;
  const { key } = data;
  if (key !== 'abcxyz') return handleRequestError({ "error": "Invalid key" }, 403);
  const invalidProperties = getInvalidProperties(data);
  const validationResults = processInvalidProperties(invalidProperties);
  if (validationResults instanceof Response) return validationResults;
  const payload = convertDataToPayload(data);
  // TODO: Create labels with this payload
}

// post localhost:3000/api/temp '{"key": "abcxyz", "orderNumber": "000140500-2", "shipFrom": { "name": "fulfillment center", "company": "fulfillment center", "street1": "3395 s. jones blvd.", "street2": "pmb#180", "city": "las vegas", "state": "nv", "postalCode": "89146", "country": "us", "phone": "8005008486" }, "shipTo": { "name": "jessica grantham", "company": "", "street1": "927 n queen st", "street2": "", "city": "martinsburg", "state": "wv", "postalCode": "25404-3544", "country": "us", "phone": "3049010284" }, "weight": 4 }'
// post 127.0.0.1:3000/api/temp '{"key": "abcxyz", "orderNumber": "", "shipFrom": { "name": "fulfillment center", "company": "fulfillment center", "street1": "", "street2": "pmb#180", "city": "las vegas", "state": "", "postalCode": "89146", "country": "", "phone": "8005008486" }, "shipTo": { "name": "", "company": "", "street1": "927 n queen st", "street2": "", "city": "martinsburg", "state": "wv", "postalCode": "25404-3544", "country": "us", "phone": "3049010284" }, "weight": 0 }'