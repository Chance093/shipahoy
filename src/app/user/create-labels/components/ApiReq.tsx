"use strict";

interface Payload {
  payload: object[];
}

export default function ApiReq({ payload }: Payload) {
  const key = "838f1031-44d9-4231-94dd-1e8f9e7b5148";
  async function createLabels(payload: Payload) {
    const url = "https://api.weshipsmart.com/api/v2/order/create-bulk-order";
    const data = {
      labelType: "priority",
      data: payload,
    };
    const config: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
      },
      body: JSON.stringify(data),
    };
    const response = fetch(url, config)
      .then((response) => {
        if (!response.ok) return Promise.reject(response);
        return response.json();
      })
      .catch((error) => {
        console.log(`%cReq failed: ${error}`, "color: red");
        return new Error(`Req failed: ${error}`);
      });
  }
  async function sendReq() {
    const res = {
      data: {
        type: "success",
        message: "Bulk order created successfully",
        bulkOrder: {
          _id: "65979d274ed5a6adbc6cb1ef",
          user: "6511c995eac45b5e35c1d6a7",
          orders: [
            {
              _id: "65979d274ed5a6adbc6cb1ed",
              uuid: "a9f17163-6e56-42b3-a3fd-48b94de447e3",
              user: "6511c995eac45b5e35c1d6a7",
              isApi: false,
              labelType: {
                _id: "65118b89f10c0c341a3d59c4",
                name: "USPS Priority (0-70lb)",
                uid: "priority",
              },
              price: 5.5,
              status: "paid",
              pdf: "./labels/64ecefcc3dd8e9c254f4ef58/92055957391631295112861035.pdf",
              tracking: "92055957391631295112861035",
              tracking_details: [],
              createdAt: "2024-01-05T06:09:43.130Z",
              updatedAt: "2024-01-05T06:09:43.130Z",
              __v: 0,
            },
          ],
          labelType: "65118b89f10c0c341a3d59c4",
          total: 5.5,
          status: "pending",
          uuid: "07895759-7270-4ecb-b11d-c743deefe106",
          csv: "./labels/64ecefcc3dd8e9c254f4ef58/07895759-7270-4ecb-b11d-c743deefe106.csv",
          pdf: "./labels/64ecefcc3dd8e9c254f4ef58/07895759-7270-4ecb-b11d-c743deefe106.pdf",
          zip: "./labels/74902989-f46e-4264-8230-90ad42540629.zip",
          createdAt: "2024-01-05T06:09:43.138Z",
          updatedAt: "2024-01-05T06:09:43.706Z",
          __v: 0,
          csvLink:
            "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/07895759-7270-4ecb-b11d-c743deefe106.csv",
          pdfLink:
            "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/07895759-7270-4ecb-b11d-c743deefe106.pdf",
          zipLink:
            "https://api.weshipsmart.com/./labels/6511c995eac45b5e35c1d6a7/07895759-7270-4ecb-b11d-c743deefe106.zip",
        },
      },
      status: 200,
      statusText: "",
      headers: { "content-type": "application/json; charset=utf-8" },
      config: {
        transitional: {
          silentJSONParsing: true,
          forcedJSONParsing: true,
          clarifyTimeoutError: false,
        },
        adapter: ["xhr", "http"],
        transformRequest: [null],
        transformResponse: [null],
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: null,
        env: {},
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-api-key": "838f1031-44d9-4231-94dd-1e8f9e7b5148",
        },
        method: "post",
        url: "https://api.weshipsmart.com/api/v2/order/create-bulk-order",
        data: '{"labelType":"priority","data":[{"FromCountry":"US","FromName":"George","FromCompany":"","FromPhone":"7755373602","FromStreet":"1011 Avocado Dr","FromStreet2":"","FromCity":"Las Vegas","FromZip":"89103","FromState":"NV","ToCountry":"US","ToName":"Kan","ToCompany":"","ToPhone":"7757640808","ToStreet":"1321 Pioche St","ToStreet2":"","ToCity":"Pahrump","ToZip":"89048","ToState":"NV","Length":10,"Height":10,"Width":10,"Weight":5,"Date":"1/4/2024"}]}',
      },
      request: {},
    };

    const pdfLink = res.data.bulkOrder.pdfLink;

    try {
      const response = await fetch(pdfLink);
      const pdfContents = await response.blob();
      const objectURL = URL.createObjectURL(pdfContents);
      window.open(objectURL);
      console.log(`Status: ${response.status}`);
    } catch (error) {
      console.log(`%cReq failed: ${error}`, "color: red");
    }
  }

  return (
    <div>
      <button onClick={sendReq} className="btn-primary">
        Test request
      </button>
      {/* { payload.map((label, index) => <div key={index} className='paragraph'>{JSON.stringify(label)}</div>) } */}
    </div>
  );
}
