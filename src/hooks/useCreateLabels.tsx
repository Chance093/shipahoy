"use client";
import axios from "axios";
import { api } from "~/trpc/react";
import { type FormData, type ResponseData, type Links, type ParsedResponse, type Payload } from "../lib/definitions";
import { env } from "~/env.mjs";

export default function useCreateLabels() {
  const key = env.NEXT_PUBLIC_MOKA_KEY;
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
      const bulkOrder = responseData.bulkOrder;
      if (!bulkOrder) return new Error("Response data does not contain bulkOrder");
      const orders = bulkOrder.orders;
      if (!orders) return new Error("Bulk order does not contain orders");
      const labelPrices = [];
      const tracking = [];
      for (const order of orders) {
        if (!order) return new Error("Bulk order does not contain order");
        const trackingNumber = order.tracking;
        const labelPrice = "" + order.price;
        tracking.push(trackingNumber);
        labelPrices.push(labelPrice);
      }
      const links: Links = {
        pdf: bulkOrder.pdfLink,
        csv: bulkOrder.csvLink,
        zip: bulkOrder.zipLink,
      };
      return { links, tracking, labelPrices };
    } catch (error) {
      console.error(`%cReq failed: ${JSON.stringify(error)}`, "color: red");
      return new Error(`Req failed: ${JSON.stringify(error)}`);
    }
  }

  const createLabelGroup = api.label.createLabel.useMutation();
  const setCounts = api.userData.updateOrderAndLabelCount.useMutation();

  const storeData = (tracking: string[], links: Links, payload: FormData[], price: string[]) => {
    if (!links || !tracking) return;
    createLabelGroup.mutate({ orders: payload, links: links, tracking: tracking, labelPrices: price });
    setCounts.mutate({ incrementOrderValue: 1, incrementLabelValue: payload.length });
  };

  return { createLabels, storeData };
}
