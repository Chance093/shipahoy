import { api } from "~/trpc/server";
import { format } from "date-fns";

export default async function InvoiceTable() {
  const invoices = await api.invoice.getInvoices.query();

  return (
    <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
        <h2 className="p-2 text-2xl">Invoices</h2>
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
      </div>
    </section>
  );
}
