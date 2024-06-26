"use client";
import { ArrowLeftIcon, ArrowUturnUpIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Fragment, type Dispatch, type SetStateAction } from "react";
import useCreateLabels from "~/hooks/useCreateLabels";
import { BalanceUpdateError, FormUIError } from "~/lib/customErrors";
import { type DuoplanePayload, type FormData, type PoOrders } from "~/lib/definitions";
import { api } from "~/trpc/react";

export default function ShipmentConfirmation({
  poOrders,
  labelPrices,
  setIsConfirmationDisplayed,
  balance,
}: {
  poOrders: PoOrders;
  labelPrices: string[];
  setIsConfirmationDisplayed: Dispatch<SetStateAction<boolean>>;
  balance: number;
}) {
  const totalPrice = labelPrices.reduce((a, b) => Number(a) + Number(b), 0).toFixed(2);
  const { createLabels, storeData } = useCreateLabels();
  const router = useRouter();

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
        };
        formData.push(newShipment);
      }),
    );

    return formData;
  };

  const getDuoplanePayload = (poOrders: PoOrders, tracking: string[]) => {
    const payloads: DuoplanePayload[] = [];
    const poIds: string[] = [];
    let trackingIdx = 0;
    poOrders.forEach((order) => {
      poIds.push(order.id);
      const payload: DuoplanePayload = {
        shipper_name: "US Postal",
        shipment_items_attributes: [],
        shipment_tracking_attributes: [],
      };
      order.order_items.forEach((orderItem) =>
        payload.shipment_items_attributes.push({ order_item_id: Number(orderItem.id), quantity: orderItem.quantity }),
      );
      for (let i = trackingIdx; i < order.shipments.length + trackingIdx; i++) {
        payload.shipment_tracking_attributes.push({ tracking: tracking[i]! });
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

  const updateDuoplane = api.duoplane.createShipment.useMutation({
    onError: () => {
      // TODO: error handling
    },
  });

  const submitPoOrders = async () => {
    try {
      // * If label creation price is 0, throw error
      if (Number(totalPrice) === 0) throw new FormUIError("Please create a shipment");

      // * If not enough balance, throw error
      if (Number(totalPrice) > balance) throw new FormUIError("Insufficient balance");

      // * Create labels with weship
      const weshipPayload = getWeshipPayload(poOrders);
      const { tracking, links } = await createLabels(weshipPayload);

      // * Store shipping labels in db
      storeData(tracking, links, weshipPayload, labelPrices);

      // * Upload tracking information to duoplane
      const duoplanePayload = getDuoplanePayload(poOrders, tracking);
      updateDuoplane.mutate(duoplanePayload);

      // * Update balance in db
      const newBalance = balance - Number(totalPrice);
      updateBalance.mutate({ amount: newBalance.toString() });

      // * Redirect to home page
      router.push("/user/dashboard");
      router.refresh();
    } catch (err) {
      throw err;
    }
  };

  let idx = -1;
  return (
    <>
      <h2 className="p-2 text-2xl">Order Confirmation</h2>
      <section className="grid w-full grid-cols-[auto_auto_auto] text-left">
        <h3 className="p-4 pb-6 font-normal">PO ID</h3>
        <h3 className="p-4 pb-6 font-normal">Buyer</h3>
        <h3 className="p-4 pb-6 font-normal">Address</h3>
        {poOrders.map((poOrder) => (
          <Fragment key={poOrder.id}>
            <p className="border-t border-gray-600/50 p-4 py-6">{poOrder.id}</p>
            <p className="border-t border-gray-600/50 p-4 py-6">
              {poOrder.address.first_name} {poOrder.address.last_name}
            </p>
            <p className="border-t border-gray-600/50 p-4 py-6">
              {poOrder.address.address_1}
              {poOrder.address.address_2 ? ", " + poOrder.address.address_2 : ""}, {poOrder.address.city}, {poOrder.address.province}{" "}
              {poOrder.address.post_code}
            </p>
            {poOrder.shipments.map((shipment) => {
              idx += 1;
              return (
                <div key={shipment.id} className="col-span-3 ml-12 flex items-end justify-start gap-8 pb-8">
                  <div>
                    <ArrowUturnUpIcon className="w-6 rotate-90 pb-2 text-gray-600" />
                  </div>
                  <p className="italic">
                    {shipment.weight} lb shipment - ${labelPrices[idx]}
                  </p>
                </div>
              );
            })}
          </Fragment>
        ))}
      </section>
      <section className="m-4 mt-auto flex justify-between">
        <div
          className="flex cursor-pointer items-center gap-4 border-b border-transparent px-2 text-xl hover:border-[#b4a3d8]"
          onClick={() => setIsConfirmationDisplayed(false)}
        >
          <ArrowLeftIcon className="w-6" />
          Edit Orders
        </div>
        <button
          className="w-52 cursor-pointer items-start rounded-md bg-purple p-4 text-center disabled:opacity-50"
          disabled={Number(totalPrice) <= 0}
          onClick={submitPoOrders}
        >
          Purchase ${totalPrice}
        </button>
      </section>
    </>
  );
}
