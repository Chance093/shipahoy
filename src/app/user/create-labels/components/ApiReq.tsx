"use strict";
import axios from "axios";
// interface Payload {
//     Weight: number;
//     Date: string;
//     FromCountry: string;
//     FromName: string;
//     FromCompany: string;
//     FromPhone: string;
//     FromStreet: string;
//     FromStreet2: string;
//     FromZip: string;
//     FromCity: string;
//     FromState: string;
//     ToCountry: 'US';
//     ToName: string;
//     ToCompany: string;
//     ToPhone: string;
//     ToStreet: string;
//     ToStreet2: string;
//     ToZip: string;
//     ToCity: string;
//     ToState: string;
//     Height: number;
//     Length: number;
//     Width: number;
// }

interface Payload {
  payload: object[];
}

export default function ApiReq({ payload }: Payload) {

  const data = {
    labelType: "priority",
    data: payload,
  };

  async function sendReq() {

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.weshipsmart.com/api/v2/order/create-bulk-order",
      headers: {
        "x-api-key": "838f1031-44d9-4231-94dd-1e8f9e7b5148",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(`FATAL ERROR: ${error}`);
      });
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


