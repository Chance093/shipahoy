import axios, { AxiosError } from "axios";
import { DuoplaneAxiosClientError, DuoplaneAxiosRedirectError } from "./customErrors";
import { type DuoplaneResponseData } from "./definitions";

export const fetchDuoplaneData = async () => {
  try {
    const { data }: { data: DuoplaneResponseData } = await axios({
      method: "get",
      url: "https://app.duoplane.com/purchase_orders.json?search[fulfilled]=false",
      headers: {
        Authorization: "Basic " + process.env.DUOPLANE_KEY_ENCODED,
      },
    });

    return data.map((data) => ({ ...data, active: false }));
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
