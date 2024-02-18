interface Payload {
  payload: object[];
}

async function createLabels(payload: Payload) {
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
    const bulkOrder = response.data.bulkOrder;
    if (!bulkOrder)
      return new Error("Response data does not contain bulkOrder");
    const orders = bulkOrder.orders;
    if (!orders) return new Error("Bulk order does not contain orders");
    const tracking = [];
    for (let x = 0; x < orders.length; ++x) {
      const order = orders[x];
      if (!order) return new Error("Bulk order does not contain order");
      const trackingNumber = order.tracking;
      tracking.push(trackingNumber);
    }
    const links = {
      pdf: bulkOrder.pdfLink,
      csv: bulkOrder.csvLink,
      zip: bulkOrder.zipLink,
    };
    storeData(links, tracking);
  } catch (error) {
    console.error(`%cReq failed: ${error}`, "color: red");
    return new Error(`Req failed: ${error}`);
  }
}

export { createLabels };
