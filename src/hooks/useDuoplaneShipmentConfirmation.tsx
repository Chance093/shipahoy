"use client";

import { BalanceUpdateError, DuoplaneAxiosRedirectError, FormUIError, LabelUploadError, OrderAndLabelCountError } from "~/lib/customErrors";
import { type DuoplanePayload, type PoOrders, type FormData } from "~/lib/definitions";
import { api } from "~/trpc/react";
import useCreateLabels from "~/hooks/useCreateLabels";
import { useRouter } from "next/navigation";
import { useState, type Dispatch, type SetStateAction } from "react";
import { AxiosError } from "axios";
import { TRPCClientError } from "@trpc/client";

export default function useDuoplaneShipmentConfirmation(
  poOrders: PoOrders,
  setErrorMessage: Dispatch<SetStateAction<string>>,
  balance: number,
  labelPrices: string[],
) {
  const { createLabels, storeData } = useCreateLabels();
  const router = useRouter();
  const totalPrice = labelPrices.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
  const [duoplaneError, setDuoplaneError] = useState<Error | null>();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // * Transform payload into weship acceptable payload
  const getWeshipPayload = (payload: PoOrders) => {
    const formData: FormData[] = [];
    payload.forEach((pload) =>
      pload.shipments.forEach((shipment) => {
        const newShipment = {
          FromCountry: "US",
          FromName: "VWU Fulfillment",
          FromCompany: "",
          FromPhone: "1-800-500-8486",
          FromStreet: "3395 S Jones Blvd",
          FromStreet2: "PMB #180",
          FromCity: "Las Vegas",
          FromZip: "89146",
          FromState: "NV",
          ToCountry: pload.address.country,
          ToName: pload.address.first_name + " " + pload.address.last_name,
          ToCompany: pload.address.company_name ? pload.address.company_name : "",
          ToPhone: pload.id,
          ToStreet: pload.address.address_1,
          ToStreet2: pload.address.address_2 ? pload.address.address_2 : "",
          ToCity: pload.address.city,
          ToZip: pload.address.post_code,
          ToState: pload.address.province_iso,
          Length: "1",
          Height: "1",
          Width: "1",
          Weight: shipment.weight,
          Reference: pload.id,
        };
        formData.push(newShipment);
      }),
    );

    return formData;
  };

  // * Transform payload into duoplane acceptable payload
  const getDuoplanePayload = (poOrders: PoOrders, tracking: string[]) => {
    const payloads: DuoplanePayload[] = [];
    const poIds: number[] = [];
    let trackingIdx = 0;

    // * For each po order, create payloads and push to payloads array
    poOrders.forEach((order) => {
      poIds.push(order.duoplaneId);

      // * Initialize payload
      const payload: DuoplanePayload = {
        shipment: {
          shipper_name: "US Postal",
          shipment_items_attributes: [],
          shipment_trackings_attributes: [],
        },
      };

      // * For each order item, push the id and quantity of the order item to payload
      order.order_items.forEach((orderItem) =>
        payload.shipment.shipment_items_attributes.push({ order_item_id: Number(orderItem.id), quantity: orderItem.quantity }),
      );

      // * For each tracking number associated with po, push the tracking numbers into payload
      for (let i = trackingIdx; i < order.shipments.length + trackingIdx; i++) {
        payload.shipment.shipment_trackings_attributes.push({ tracking: tracking[i]! });
      }

      trackingIdx += order.shipments.length;
      payloads.push(payload);
    });

    return { poIds, payloads };
  };

  const updateBalance = api.balance.update.useMutation({
    onError: (err) => {
      if (err instanceof Error) {
        throw new BalanceUpdateError(`Couldn't Update Balance: ${err.message}`);
      }
    },
  });

  const updateDuoplane = api.duoplane.createShipment.useMutation();

  const submitPoOrders = async () => {
    try {
      // * Reset state
      setErrorMessage("");
      setDuoplaneError(null);

      // * Start loading state
      setIsButtonLoading(true);

      // * If label creation price is 0, throw error
      if (Number(totalPrice) === 0) throw new FormUIError("Please create a shipment");

      // * If not enough balance, throw error
      if (Number(totalPrice) > balance) throw new FormUIError("Insufficient Funds - Please add more to your account");

      // * Create labels with weship
      const weshipPayload = getWeshipPayload(poOrders);
      const { tracking, links } = await createLabels(weshipPayload);

      // * Store shipping labels in db
      await storeData(tracking, links, weshipPayload, labelPrices);

      // * Upload tracking information to duoplane
      const duoplanePayload = getDuoplanePayload(poOrders, tracking);
      await updateDuoplane.mutateAsync(duoplanePayload);

      // * Update balance in db
      const newBalance = balance - Number(totalPrice);
      await updateBalance.mutateAsync({ amount: newBalance.toString() });

      // * End loading state
      setIsButtonLoading(false);

      // * Redirect to home page
      router.push("/user/dashboard");
      router.refresh();
    } catch (err) {
      setIsButtonLoading(false);
      // * If error is FormUIError, display error on duoplane page
      if (err instanceof FormUIError) {
        setErrorMessage(err.message);
      }

      // * If error was from store data, redirect to error page and display message
      else if (err instanceof LabelUploadError || err instanceof OrderAndLabelCountError) {
        setDuoplaneError(new DuoplaneAxiosRedirectError(err.message));
      }

      // * All other errors
      else if (err instanceof Error) {
        if (err instanceof TRPCClientError) {
          // * If TRPC error, redirect to error page and display message
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (err.data.code === "NOT_IMPLEMENTED" || err.data.code === "CONFLICT") {
            setDuoplaneError(new DuoplaneAxiosRedirectError(err.message));
          }
        }

        // * If Axios error, let user know weship servers are down
        else if (err instanceof AxiosError) {
          setDuoplaneError(new DuoplaneAxiosRedirectError("The server for our service provider is down. Please contact us."));
        }

        // * Catch all error
        else {
          setDuoplaneError(new Error(err.message));
        }
      }
    }
  };

  return { duoplaneError, totalPrice, submitPoOrders, isButtonLoading };
}
