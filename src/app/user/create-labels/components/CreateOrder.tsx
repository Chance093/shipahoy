"use strict";
import axios from "axios";

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

const response = {
  type: "success",
  message: "Bulk order created successfully",
  bulkOrder: {
    _id: "65cec2a11fbc6dd9285e236a",
    user: "6511c995eac45b5e35c1d6a7",
    orders: [
      {
        _id: "65cec2a11fbc6dd9285e2368",
        uuid: "dca338af-b473-4ee8-940e-414e3237bd57",
        user: "6511c995eac45b5e35c1d6a7",
        isApi: false,
        labelType: {
          _id: "65118b89f10c0c341a3d59c4",
          name: "USPS Priority (0-70lb)",
          uid: "priority",
        },
        price: 5.5,
        status: "paid",
        pdf: "./labels/64ecefcc3dd8e9c254f4ef58/92055958439379198892887060.pdf",
        tracking: "92055958439379198892887060",
        tracking_details: [],
        createdAt: "2024-02-16T02:04:17.916Z",
        updatedAt: "2024-02-16T02:04:17.916Z",
        __v: 0,
      },
    ],
    labelType: "65118b89f10c0c341a3d59c4",
    total: 5.5,
    status: "pending",
    uuid: "3fadc629-229d-48f9-afee-1cd5b9866296",
    csv: "./labels/64ecefcc3dd8e9c254f4ef58/3fadc629-229d-48f9-afee-1cd5b9866296.csv",
    pdf: "./labels/64ecefcc3dd8e9c254f4ef58/3fadc629-229d-48f9-afee-1cd5b9866296.pdf",
    zip: "./labels/e9732961-18c4-4af3-8ae7-ddc1648c2745.zip",
    createdAt: "2024-02-16T02:04:17.921Z",
    updatedAt: "2024-02-16T02:04:18.491Z",
    __v: 0,
    csvLink: "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/3fadc629-229d-48f9-afee-1cd5b9866296.csv",
    pdfLink: "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/3fadc629-229d-48f9-afee-1cd5b9866296.pdf",
    zipLink: "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/3fadc629-229d-48f9-afee-1cd5b9866296.zip",
  },
};

type Payload = Record<string, string>[];
export default function ApiReq(payload: Payload) {
  const key = "838f1031-44d9-4231-94dd-1e8f9e7b5148";
  // type Links = Record<string, string>;
  // async function storeData(links: Links, tracking: string[]): Promise<void> {
  //   console.log(`Links: ${JSON.stringify(links)}`); //! function for storing data from the API response
  //   console.log(`Tracking: ${JSON.stringify(tracking)}`);
  // }

  async function createLabels() {
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
      // const links = {
      //   pdf: bulkOrder.pdfLink,
      //   csv: bulkOrder.csvLink,
      //   zip: bulkOrder.zipLink,
      // };
      // storeData(links, tracking); //! function for storing data from the API response
    } catch (error) {
      console.error(`%cReq failed: ${JSON.stringify(error)}`, "color: red");
      return new Error(`Req failed: ${JSON.stringify(error)}`);
    }
  }

  async function getFile(type: string, bulkOrderID: string) {
    let link: string;
    switch (type) {
      case "pdf":
        link = "";
        // TODO: get pdf link from database
        break;
      case "csv":
        link = "";
        // TODO: get csv link from database
        break;
      default:
        console.error(`%cInvalid type: ${type}`, "color: red");
        return new Error(`Invalid type: ${type}`);
    }

    function downloadFile(url: string, filename: string): void {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    try {
      const response = await fetch(link);
      const contents = await response.blob();
      const url = URL.createObjectURL(contents);
      downloadFile(url, `${bulkOrderID}.${type}`);
      console.log(`Status: ${response.status}`);
    } catch (error) {
      console.log(`%cReq failed: ${JSON.stringify(error)}`, "color: red");
    }
  }

  return (
    <div>
      <button onClick={() => getFile("pdf", "link here")} className="btn-primary">
        Test request
      </button>
      {/* { payload.map((label, index) => <div key={index} className='paragraph'>{JSON.stringify(label)}</div>) } */}
    </div>
  );
}
