import axios, { AxiosError } from "axios";
import { DuoplaneAxiosClientError, DuoplaneAxiosRedirectError } from "./customErrors";
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

export const updateDuoplane = async (payload: DuoplanePayload[], { key, password }: { key: string; password: string }) => {
  try {
    // TODO: Create post request for every payload
    const encodedString = btoa(`${key}:${password}`);
    await axios({
      method: "post",
      url: "https://app.duoplane.com/purchase_orders.json?search[fulfilled]=false",
      headers: {
        Authorization: "Basic " + encodedString,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      // TODO: handle errors
    }
  }
};
