import axios, { AxiosError, type AxiosResponse } from "axios";
import { DuoplaneAxiosClientError, DuoplaneAxiosRedirectError, DuoplaneCreateShipmentError } from "./customErrors";
import { type DuoplaneResponseHeaders, type DuoplaneResponseData, type DuoplanePayload } from "./definitions";

export const fetchDuoplaneData = async ({ key, password }: { key: string; password: string }) => {
  try {
    const encodedString = btoa(`${key}:${password}`);
    const { data, headers }: { data: DuoplaneResponseData; headers: DuoplaneResponseHeaders } = await axios({
      method: "get",
      url: "https://app.duoplane.com/purchase_orders.json?search[fulfilled]=false",
      headers: {
        Authorization: "Basic " + encodedString,
      },
    });

    const mappedData = data.map((data) => ({ ...data, active: false }));

    return { headers: headers, data: mappedData };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response) {
        // * The request was made and the server responded with a status code
        if (err.response.status === 429) throw new DuoplaneAxiosClientError("Too Many Requests - Please try again later.");
        if (err.response.status === 401) throw new DuoplaneAxiosClientError("Unauthorized - Please check your Duoplane API key.");
        if (err.response.status >= 500) throw new DuoplaneAxiosClientError("Duoplane Server Error - Please try again later.");
        throw new DuoplaneAxiosRedirectError("Duoplane Error - Please contact service provider.");
      } else if (err.request) {
        // * The request was made but no response was received
        throw new DuoplaneAxiosRedirectError("Duoplane Connection Error - Response not found.");
      } else {
        // * Something happened in setting up the request that triggered an error
        throw err;
      }
    }
    throw err;
  }
};

type DuoplaneSettledPromise = {
  status: "rejected" | "fulfilled";
  reason: {
    request: {
      path: string;
    };
    response: {
      statusText: string;
    };
  };
}[];

export const updateDuoplane = async (
  { poIds, payloads }: { poIds: string[]; payloads: DuoplanePayload[] },
  { key, password }: { key: string; password: string },
) => {
  // * Create base64 encoded string for auth header
  const encodedString = btoa(`${key}:${password}`);

  // * Set all axios post requests inside array to be used in promise
  const axiosPosts: Promise<AxiosResponse>[] = [];
  payloads.forEach((payload, idx) => {
    const config = {
      method: "post",
      url: `https://app.duoplane.com/purchase_orders/${poIds[idx]}/shipments.json`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + encodedString,
      },
      data: payload,
    };
    axiosPosts.push(axios(config));
  });

  // * Execute all axios post requests, then take all the failed responses and throw error to user
  const results = (await Promise.allSettled(axiosPosts)) as DuoplaneSettledPromise;
  const failedRequests = results
    .filter((result) => result.status === "rejected")
    .map((result) => {
      return { poId: result.reason.request.path.split("/")[2], code: result.reason.response.statusText };
    });

  // * If every request fails, throw this error
  if (failedRequests.length === results.length) throw new DuoplaneCreateShipmentError("Shipments were made but failed to upload to duoplane");

  // * If only some requests fail, throw this error
  if (failedRequests.length !== 0) {
    throw new DuoplaneCreateShipmentError(`These shipments were made but failed to upload to duoplane: ${JSON.stringify(failedRequests)}`);
  }
};
