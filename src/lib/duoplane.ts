import axios from "axios";

export const fetchDuoplaneData = async () => {
  return await axios({
    method: "get",
    url: "https://app.duoplane.com/purchase_orders.json?search[fulfilled]=false",
    headers: {
      Authorization: "Basic " + process.env.DUOPLANE_KEY_ENCODED,
    },
  });
};
