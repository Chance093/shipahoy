import { format } from "date-fns";
import { api } from "~/trpc/server";

export default async function ShippingHistoryTable() {
  const shippingHistory = await api.labelGroup.getShippingHistory.query();

  return (
    <ul className="w-full ">
      <li className="flex justify-between ">
        <p className="p-5">#</p>
        <p className="p-5">Date</p>
        <p className="p-5">Size</p>
        <p className="p-5">Type</p>
        <p className="p-5">Price</p>
        <p className="p-5">Files</p>
      </li>
      {shippingHistory?.map((item) => (
        <li className="flex justify-between  text-xs" key={item.id}>
          <p className="p-5">{item.id}</p>
          <p className="p-5">
            {item.createdAt ? format(item.createdAt, "MM-dd-yyyy") : ""}
          </p>
          <p className="p-5">{item.labelCount}</p>
          <p className="p-5">{item.shippingService.service}</p>
          <p className="p-5">${item.totalPrice}</p>
          <p className="p-5">^</p>
        </li>
      ))}
    </ul>
  );
}
