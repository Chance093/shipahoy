import { type Invoices } from "~/lib/definitions";
import { format } from "date-fns";

export default function Invoices({ invoices }: { invoices: Invoices }) {
  return (
    <>
      {invoices.length === 0 ? (
        <div className="flex flex-1 items-center justify-center pb-8">
          <p className="text-2xl">You have no invoices!</p>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead className="text-custom-gray ">
            <tr className="border-b border-gray-600/50">
              <th className="p-4 pb-6 font-normal">Date</th>
              <th className="p-4 pb-6 font-normal">Amount</th>
              <th className="p-4 pb-6 font-normal">Payment Method</th>
              <th className="p-4 pb-6 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 && <p>You have no invoices!</p>}
            {invoices?.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-600/50">
                <td className="p-4 py-6">{invoice.createdAt ? format(invoice.createdAt, "MM-dd-yyyy") : ""}</td>
                <td className="p-4 py-6">{invoice.amount}</td>
                <td className="p-4 py-6">{invoice.paymentMethod}</td>
                <td className="p-4 py-6">{invoice.paymentStatus.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
