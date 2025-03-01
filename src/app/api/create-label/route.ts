import axios from "axios";
import { type Links, type ResponseData } from "~/lib/definitions";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { balance, label, labelAddress, labelGroup, parcel, pricing, userData } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { calculateCost } from "~/lib/calculateCost";

type LabelRequest = {
  key: string;
  orderNumber: string;
  shipFrom: ShippingAddress;
  shipTo: ShippingAddress;
  physicalProperties: PhysicalProperties;
};

type PhysicalProperties = {
  weight: number;
  length: number;
  width: number;
  height: number;
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
  length: string | null;
  width: string | null;
  height: string | null;
};

type Payload = {
  labelType: string;
  ToCountry: string;
  ToName: string;
  ToCompany: string;
  ToStreet1: string;
  ToStreet2: string;
  ToCity: string;
  ToZip: string;
  ToState: string;
  ToPhone: string;
  FromCountry: string;
  FromName: string;
  FromCompany: string;
  FromStreet1: string;
  FromStreet2: string;
  FromCity: string;
  FromZip: string;
  FromState: string;
  FromPhone: string;
  Weight: number;
  Length: number;
  Height: number;
  Width: number;
};

type Balance = {
  amount: string;
};

type UserPricing = {
  zeroToFour: string;
  fourToEight: string;
  eightToFifteen: string;
  fifteenToTwentyFive: string;
  twentyFiveToThirtyFive: string;
  thirtyFiveToFortyFive: string;
  fortyFiveToFiftyFive: string;
  fiftyFiveToSixtyFive: string;
  sixtyFiveToSeventy: string;
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
    length: null,
    width: null,
    height: null,
  };
  const { orderNumber, shipFrom, shipTo, physicalProperties } = data;
  const { weight: weightProperty, length: lengthProperty, width: widthProperty, height: heightProperty } = physicalProperties;

  // * If order number missing, set invalid order number property
  if (!orderNumber) {
    const templateLiteral = `${typeof orderNumber === "string" ? "an empty string" : void orderNumber}`;
    invalidProperties.orderNumber = `orderNumber is required; instead received ${templateLiteral}`;
  }

  // * Set invalid weight property
  const weight = Number(weightProperty);
  switch (true) {
    case Number.isNaN(weight): {
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

  if (Number.isNaN(lengthProperty)) invalidProperties.length = "length should be a valid number";
  if (Number.isNaN(widthProperty)) invalidProperties.width = "width should be a valid number";
  if (Number.isNaN(heightProperty)) invalidProperties.height = "height should be a valid number";

  // * Set invalid address properties
  validateShipment(shipFrom, invalidProperties.shipFrom);
  validateShipment(shipTo, invalidProperties.shipTo);

  return invalidProperties;
};

// * Take invalid props and make it a readable message
const processInvalidProperties = (invalidProperties: InvalidProperties) => {
  const { orderNumber, shipFrom, shipTo, weight, length, width, height } = invalidProperties;
  const errors: string[] = [];
  if (orderNumber) errors.push(orderNumber);
  if (weight) errors.push(weight);
  if (length) errors.push(length);
  if (width) errors.push(width);
  if (height) errors.push(height);
  if (shipFrom.length) errors.push(`Invalid properties of shipFrom: ${shipFrom.join(", ")}`);
  if (shipTo.length) errors.push(`Invalid properties of shipTo: ${shipTo.join(", ")}`);
  if (!errors.length) return void 0;
  let message = "Invalid properties:";
  for (let x = 0; x < errors.length; ++x) message = `${message}\n${x + 1}. ${errors[x]}`;
  return handleRequestError({ error: message }, 400);
};

// * Converts payload to weship friendly payload
const convertDataToPayload = (data: LabelRequest) => {
  const { shipFrom, shipTo, physicalProperties } = data;
  const { weight, length, width, height } = physicalProperties;
  const payload = {
    labelType: "priority",
    ToCountry: shipTo.country,
    ToName: shipTo.name,
    ToCompany: shipTo.company,
    ToStreet1: shipTo.street1,
    ToStreet2: shipTo.street2,
    ToCity: shipTo.city,
    ToZip: shipTo.postalCode,
    ToState: shipTo.state,
    ToPhone: shipTo.phone,
    FromCountry: shipFrom.country,
    FromName: shipFrom.name,
    FromCompany: shipFrom.company,
    FromStreet1: shipFrom.street1,
    FromStreet2: shipFrom.street2,
    FromCity: shipFrom.city,
    FromZip: shipFrom.postalCode,
    FromState: shipFrom.state,
    FromPhone: shipFrom.phone,
    Weight: weight,
    Length: length,
    Width: width,
    Height: height,
  };
  return payload;
};

const getResponseData = async (payload: Payload[]) => {
  const url = "https://api.ezyship.org/api/v2/order/create-bulk-order";
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

  try {
    const { data: responseData }: { data: ResponseData } = await axios.post(url, data, config);
    return responseData;
  } catch {
    const postError = new Error();
    postError.message = `Error while attempting to label data to USPS`;
    return postError;
  }
}

async function createLabels(payload: Payload[]) {
  // * Create labels with weship
  const responseData = await getResponseData(payload);
  if (responseData instanceof Error) {
    const labelCreationError = new Error();
    labelCreationError.message = `Error while creating labels: ${responseData.message}`;
    return labelCreationError;
  }
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

const uploadLabelToDatabase = async (payload: Payload, links: Links, tracking: string, price: string, userId: string) => {
  // * Create label group
  let newLabelGroup;
  try {
    newLabelGroup = await db.insert(labelGroup).values({
      userId,
      shippingServiceId: 1,
      labelCount: 1,
      totalPrice: price,
      pdfLink: links.pdf,
      csvLink: links.csv,
      zipLink: links.zip,
    });
  } catch (error) {
    const labelGroupError = new Error();
    labelGroupError.message = `Error while creating label group: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return labelGroupError;
  }
  const labelGroupId = newLabelGroup.insertId;

  // * Create label and associate with label group
  let newLabel;
  try {
    newLabel = await db.insert(label).values({
      labelGroupId: Number(labelGroupId),
      uspsServiceId: 1,
      price,
      tracking,
    });
  } catch (error) {
    const labelError = new Error();
    labelError.message = `Error while creating label: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return labelError;
  }
  const labelId = newLabel.insertId;

  const results = await Promise.allSettled([
    db.insert(parcel).values({
      labelId: Number(labelId),
      weight: payload.Weight,
      length: payload.Length,
      width: payload.Width,
      height: payload.Height,
    }),
    db.insert(labelAddress).values({
      labelId: Number(labelId),
      isSender: true,
      name: payload.FromName,
      company: payload.FromCompany,
      streetOne: payload.FromStreet1,
      streetTwo: payload.FromStreet2,
      city: payload.FromCity,
      state: payload.FromState,
      zipCode: payload.FromZip,
      country: payload.FromCountry,
      phoneNumber: payload.FromPhone,
    }),
    db.insert(labelAddress).values({
      labelId: Number(labelId),
      isSender: false,
      name: payload.ToName,
      company: payload.ToCompany,
      streetOne: payload.ToStreet1,
      streetTwo: payload.ToStreet2,
      city: payload.ToCity,
      state: payload.ToState,
      zipCode: payload.ToZip,
      country: payload.ToCountry,
      phoneNumber: payload.ToPhone,
    }),
    db.update(userData).set({
      orderCount: sql`${userData.orderCount} + 1`,
      labelCount: sql`${userData.labelCount} + 1`,
    }).where(eq(userData.userId, userId)),
  ]);

  const rejectedOperations = [];
  for (let x = 0; x < results.length; ++x) {
    const result = results[x]!;
    const status = result.status;
    if (status === "rejected") {
      rejectedOperations.push(`${x + 1}. ${result?.reason}`);
      continue;
    }
  }

  if (rejectedOperations.length) {
    const operationsError = new Error();
    operationsError.message = `Error while uploading label data to our database: ${rejectedOperations.join(", ")}`;
    throw operationsError;
  }
};

const updateBalance = async (currentBalance: string, price: string, userId: string) => {
  const updatedBalance = Number(currentBalance) - Number(price);
  try {
    await db
      .update(balance)
      .set({
        amount: String(updatedBalance),
      })
      .where(eq(balance.userId, userId));
  } catch (error) {
    const updateBalanceError = new Error();
    updateBalanceError.message = `Error while updating balance: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return updateBalanceError;
  }

}

const getBalance = async (userId: string) => {
  try {
    const amount = await db.query.balance.findFirst({
      where: eq(balance.userId, userId),
      columns: { amount: true },
    });
    if (amount?.amount === null) {
      const balanceError = new Error();
      balanceError.message = `Balance not found`;
      return balanceError;
    }
    return amount;
  } catch (error) {
    if (error instanceof Error) {
      const getBalanceError = new Error();
      getBalanceError.message = `Error while getting balance: ${error.message} `;
      return getBalanceError;
    }
  }
};

const getUserPricing = async (userId: string) => {
  try {
    const pricingTable = await db.query.pricing.findFirst({
      where: eq(pricing.userId, userId),
      columns: {
        zeroToFour: true,
        fourToEight: true,
        eightToFifteen: true,
        fifteenToTwentyFive: true,
        twentyFiveToThirtyFive: true,
        thirtyFiveToFortyFive: true,
        fortyFiveToFiftyFive: true,
        fiftyFiveToSixtyFive: true,
        sixtyFiveToSeventy: true,
      },
    });
    if (pricingTable === undefined) {
      const userPricingError = new Error();
      userPricingError.message = `User pricing not found`;
      throw userPricingError;
    }
    return pricingTable;
  } catch (error) {
    if (error instanceof Error) {
      const getUserPricingError = new Error();
      getUserPricingError.message = `Error while getting user pricing: ${error.message} `;
      return getUserPricingError;
    }
  }
};

const getPrice = (payload: Record<string, string | number>, userPricing: UserPricing) => {
  try {
    const pricing = calculateCost([String(payload.Weight!)], userPricing);
    return pricing;
  } catch (error) {
    const priceError = new Error();
    priceError.message = `Error while calculating price: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return handleRequestError({ error: priceError.message }, 500);
  }
}

const getLabelLink = (rawLabelLink: string) => {
  const linkRegex = /\/labels\/(.*)\/(.*)\.pdf/;
  const linkMatch = rawLabelLink.match(linkRegex);
  const slug = linkMatch![1];
  const slub = linkMatch![2];
  const labelLink = `https://progloshipping.com/api/labels/${slug}/${slub}.pdf`;
  return labelLink;
}

export const POST = async (request: Request) => {

  // * Capture client payload
  const data = (await request.json()) as LabelRequest;

  // * Validate client key
  const authHeader = request.headers.get("Authorization");
  const key = process.env.KARTER_KEY;
  if (authHeader !== key) return handleRequestError({ error: `Invalid authorization header.` }, 403);
  const userId = process.env.KARTER_USER_ID!;

  // * Validate payload
  const invalidProperties = getInvalidProperties(data);
  const validationResults = processInvalidProperties(invalidProperties);
  if (validationResults instanceof Response) return validationResults;

  // * Convert payload
  const payload = convertDataToPayload(data);

  // * Get user balance and label pricing
  const balance = await getBalance(userId) as Balance | Error;
  if (balance instanceof Error) return handleRequestError({ error: "Balance not found" }, 500);
  const userPricing = await getUserPricing(userId) as UserPricing | Error;
  if (userPricing instanceof Error) return handleRequestError({ error: "User pricing not found" }, 500);

  // * Calculate price and check if user has sufficient balance
  const price = getPrice(payload, userPricing);
  if (price instanceof Response) return price;
  if (Number(balance.amount) < Number(price[0])) return handleRequestError({ error: "Insufficient balance. Please make a payment before attempting again." }, 402);

  // * Create labels in weship
  const labelCreationResults = await createLabels([payload]);
  if (labelCreationResults instanceof Error) return handleRequestError({ error: `${labelCreationResults.message}` }, 500);
  const { tracking, links } = labelCreationResults;

  // * Upload labels in DB and update balance
  await uploadLabelToDatabase(payload, links, tracking[0]!, price[0]!, userId);
  await updateBalance(balance.amount, price[0]!, userId);

  // * Get the label link in our format
  const rawLabelLink = links.pdf;
  const labelLink = getLabelLink(rawLabelLink);

  // * Return tracking to client
  const responseData = {
    trackingNumber: tracking[0],
    label: labelLink,
  };
  const responseBody = JSON.stringify(responseData);
  const responseParams = { status: 201, "Content-Type": "application/json" };
  return new Response(responseBody, responseParams);
};
