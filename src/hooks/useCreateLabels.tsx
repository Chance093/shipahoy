"use client";
import axios from "axios";
import { api } from "~/trpc/react";
import { type FormData, type ResponseData, type Links, type Payload } from "../lib/definitions";
import { env } from "~/env.mjs";
import { LabelUploadError, OrderAndLabelCountError, WeShipError } from "~/lib/customErrors";

export default function useCreateLabels() {
  const key = env.NEXT_PUBLIC_MOKA_KEY;
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
        "x-api-key": key,
      },
      body: JSON.stringify(data),
    };

    // * Create labels with weship
    const { data: responseData }: { data: ResponseData } = await axios.post(url, data, config);
    const bulkOrder = responseData.bulkOrder;
    const orders = bulkOrder.orders;

    // * Grab all tracking numbers from weship
    const tracking = [];
    if (orders.length === 0) throw new WeShipError("No orders found in response");
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

  const createLabelGroup = api.label.createLabel.useMutation({
    onError: (err) => {
      if (err instanceof Error) {
        throw new LabelUploadError(`Labels were created but never uploaded to our database: ${err.message}`);
      }
    },
  });
  const setCounts = api.userData.updateOrderAndLabelCount.useMutation({
    onError: (err) => {
      if (err instanceof Error) {
        throw new OrderAndLabelCountError(`Database counts were not incremented properly: ${err.message}`);
      }
    },
  });

  const storeData = (tracking: string[], links: Links, payload: FormData[], price: string[]) => {
    createLabelGroup.mutate({ orders: payload, links: links, tracking: tracking, labelPrices: price });
    setCounts.mutate({ incrementOrderValue: 1, incrementLabelValue: payload.length });
  };

  return { createLabels, storeData };
}
