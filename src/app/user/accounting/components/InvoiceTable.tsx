import { api } from "~/trpc/server";
import { format } from "date-fns";

export default async function InvoiceTable() {
  const invoices = await api.invoice.getInvoices.query();

  return (
    <section className="bg-linear-gradient rounded-2xl">
      <div className="bg-radial-gradient flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl p-5">
        <h2 className="p-2 text-2xl">Invoices</h2>

        <table className="w-full text-left">
          <thead className="text-test-gray ">
            <tr className="border-b border-gray-600/50">
              <th className="p-4 pb-6 font-normal">Date</th>
              <th className="p-4 pb-6 font-normal">Amount</th>
              <th className="p-4 pb-6 font-normal">Payment Method</th>
              <th className="p-4 pb-6 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map((invoice, idx) => (
              <tr
                key={invoice.id}
                className={
                  idx === invoices.length - 1
                    ? ""
                    : "border-b border-gray-600/50"
                }
              >
                <td className="p-4 py-6">
                  {invoice.createdAt
                    ? format(invoice.createdAt, "MM-dd-yyyy")
                    : ""}
                </td>
                <td className="p-4 py-6">{invoice.amount}</td>
                <td className="p-4 py-6">{invoice.paymentMethod}</td>
                <td className="p-4 py-6">{invoice.paymentStatus.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    // <ul className='w-full card overflow-x-scroll text-left'>
    //   <li className='border-b border-purple-200/20 flex justify-between'>
    //     <p className='p-5'>Date</p>
    //     <p className='p-5'>Amount</p>
    //     <p className='p-5'>Payment Method</p>
    //     <p className='p-5'>Status</p>
    //   </li>
    //   {invoices?.map((item) => (
    //     <li
    //       className='border-b border-purple-200/20 text-xs flex justify-between'
    //       key={item.id}
    //     >
    //       <p className='p-5'>
    //         {item.createdAt ? format(item.createdAt, 'MM-dd-yyyy') : ''}
    //       </p>
    //       <p className='p-5'>{item.amount}</p>
    //       <p className='p-5'>{item.paymentMethod}</p>
    //       <p className='p-5'>{item.paymentStatus.status}</p>
    //     </li>
    //   ))}
    // </ul>
  );
}
