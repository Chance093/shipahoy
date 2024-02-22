"use strict";
import axios from "axios";

interface Payload {
  FromCountry: string;
  FromName: string;
  FromCompany: string;
  FromPhone: string;
  FromStreet: string;
  FromStreet2: string;
  FromCity: string;
  FromZip: string;
  FromState: string;
  ToCountry: string;
  ToName: string;
  ToCompany: string;
  ToPhone: string;
  ToStreet: string;
  ToStreet2: string;
  ToCity: string;
  ToZip: string;
  ToState: string;
  Length: string;
  Height: string;
  Width: string;
  Weight: string;
}

interface ResponseData {
  type: string;
  message: string;
  bulkOrder: BulkOrder;
}

interface BulkOrder {
  _id: string;
  user: string;
  orders: Order[];
  labelType: string;
  total: number;
  status: string;
  uuid: string;
  csv: string;
  pdf: string;
  zip: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  csvLink: string;
  pdfLink: string;
  zipLink: string;
}

interface Order {
  _id: string;
  uuid: string;
  user: string;
  isApi: boolean;
  labelType: LabelType;
  price: number;
  status: string;
  pdf: string;
  tracking: string;
  tracking_details: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LabelType {
  _id: string;
  name: string;
  uid: string;
}

type Links = {
  pdf: string;
  csv: string;
  zip: string;
};
type ParsedResponse = { links: Links; tracking: string[] };

const key = "838f1031-44d9-4231-94dd-1e8f9e7b5148";
async function createLabels(payload: Payload[]): Promise<Error | ParsedResponse> {
  const url = "https://api.weshipsmart.com/api/v2/order/create-bulk-order";
  const data = {
    labelType: "priority",
    data: payload,
  };
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await axios.post(url, data, config);
    const responseData = response.data as ResponseData;
    const bulkOrder: BulkOrder = responseData.bulkOrder;
    if (!bulkOrder) return new Error("Response data does not contain bulkOrder");
    const orders = bulkOrder.orders;
    if (!orders) return new Error("Bulk order does not contain orders");
    const tracking = [];
    for (const order of orders) {
      if (!order) return new Error("Bulk order does not contain order");
      const trackingNumber = order.tracking;
      tracking.push(trackingNumber);
    }
    const links: Links = {
      pdf: bulkOrder.pdfLink,
      csv: bulkOrder.csvLink,
      zip: bulkOrder.zipLink,
    };
    const parsedResponse: ParsedResponse = { links, tracking };
    return parsedResponse;
  } catch (error) {
    console.error(`%cReq failed: ${JSON.stringify(error)}`, "color: red");
    return new Error(`Req failed: ${JSON.stringify(error)}`);
  }
}

export { createLabels, type ParsedResponse };
