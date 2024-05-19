import { type ShippingHistory } from "~/lib/definitions";
import DownloadButton from "./DownloadButton";
import { format } from "date-fns";

export default function Orders({ shippingHistory }: { shippingHistory: ShippingHistory }) {
  return (
    <>
      {shippingHistory.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-8">
          <p className="text-2xl">You have no orders!</p>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead className="text-custom-gray ">
            <tr className="border-b border-gray-600/50">
              <th className="p-4 pb-6 font-normal">#</th>
              <th className="p-4 pb-6 font-normal">Date</th>
              <th className="p-4 pb-6 font-normal">Labels</th>
              <th className="p-4 pb-6 font-normal">Type</th>
              <th className="p-4 pb-6 font-normal">Price</th>
              <th className="pb-2 font-normal">
                <div className="w-12 text-center">PDF</div>
              </th>
              <th className="pb-2 font-normal">
                <div className="w-12 text-center">CSV</div>
              </th>
              <th className="pb-2 font-normal">
                <div className="w-12 text-center">ZIP</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {shippingHistory?.map((group, idx) => (
              <tr key={group.id} className="border-b border-gray-600/50">
                <td className="p-4 py-6">{idx + 1}</td>
                <td className="p-4 py-6">{group.createdAt ? format(group.createdAt, "MM-dd-yyyy") : ""}</td>
                <td className="p-4 py-6">{group.labelCount}</td>
                <td className="p-4 py-6">{group.shippingService.service}</td>
                <td className="p-4 py-6">${group.totalPrice}</td>
                <td className="py-6">
                  <DownloadButton fileLink={group.pdfLink} />
                </td>
                <td className="py-6">
                  <DownloadButton fileLink={group.csvLink} />
                </td>
                <td className="py-6">
                  <DownloadButton fileLink={group.zipLink} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
