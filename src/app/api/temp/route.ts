import { NextResponse } from "next/server";

// interface LabelRequest {
//   "orderNumber": string;
//   "shipFrom": {
//     "name": string;
//     "company": string;
//     "street1": string;
//     "street2": string;
//     "street3": string;
//     "city": string;
//     "state": string;
//     "postalCode": string;
//     "country": string;
//     "phone": string;
//   }
//   "shipTo": {
//     "name": string;
//     "company": string;
//     "street1": string;
//     "street2": string;
//     "street3": string;
//     "city": string;
//     "state": string;
//     "postalCode": string;
//     "country": string;
//     "phone": string;
//   },
//   "service": string;
//   "weight": number;
//   "label": string;
// }

// const req: LabelRequest = {
//   "orderNumber": "000140500-2",
//   "shipFrom": {
//     "name": "Fulfillment Center",
//     "company": "Fulfillment Center",
//     "street1": "3395 S. JONES BLVD.",
//     "street2": "PMB#180",
//     "street3": "",
//     "city": "Las Vegas",
//     "state": "NV",
//     "postalCode": "89146",
//     "country": "US",
//     "phone": "8005008486"
//   },
//   "shipTo": {
//     "name": "Jessica Grantham",
//     "company": "",
//     "street1": "927 N QUEEN ST",
//     "street2": "",
//     "street3": "",
//     "city": "MARTINSBURG",
//     "state": "WV",
//     "postalCode": "25404-3544",
//     "country": "US",
//     "phone": "3049010284"
//   },
//   "service": "usps priority 0-70lbs",
//   "weight": 4,
//   "label": "usps priority 0-70lbs"
// }

// cURL localhost:3000/api/temp?key=ABCxyz
// curl localhost:3000/api/temp?key=ABCxyz

export const GET = (request: Request) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const key = params.get('key');
  const response: NextResponse = NextResponse.json({ msg: key });
  return response;
}

