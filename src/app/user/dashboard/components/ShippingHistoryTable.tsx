import { format } from "date-fns";
import { api } from "~/trpc/server";

export default async function ShippingHistoryTable() {
  const shippingHistory = await api.labelGroup.getShippingHistory.query();

  return (
    <section className="bg-linear-gradient rounded-2xl">
      <div className="bg-radial-gradient flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl p-5">
        <h2 className="p-2 text-2xl">Shipping History</h2>

        <table className="w-full text-left">
          <thead className="text-test-gray ">
            <tr className="border-b border-gray-600/50">
              <th className="p-4 pb-6 font-normal">#</th>
              <th className="p-4 pb-6 font-normal">Date</th>
              <th className="p-4 pb-6 font-normal">Labels</th>
              <th className="p-4 pb-6 font-normal">Type</th>
              <th className="p-4 pb-6 font-normal">Price</th>
              <th className="p-4 pb-6 font-normal">Download</th>
            </tr>
          </thead>
          <tbody>
            {shippingHistory?.map((group, idx) => (
              <tr
                key={group.id}
                className={
                  idx === shippingHistory.length - 1
                    ? ""
                    : "border-b border-gray-600/50"
                }
              >
                <td className="p-4 py-6">{group.id}</td>
                <td className="p-4 py-6">
                  {group.createdAt ? format(group.createdAt, "MM-dd-yyyy") : ""}
                </td>
                <td className="p-4 py-6">{group.labelCount}</td>
                <td className="p-4 py-6">{group.shippingService.service}</td>
                <td className="p-4 py-6">${group.totalPrice}</td>
                <td className="p-4 py-6">^^</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
