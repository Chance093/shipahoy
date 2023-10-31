import { api } from '~/trpc/server';
import { format } from 'date-fns';

export default async function InvoiceTable() {
  const invoices = await api.invoice.getInvoices.query();

  return (
    <ul className='w-full card overflow-x-scroll text-left'>
      <li className='border-b border-purple-200/20 flex justify-between'>
        <p className='p-5'>Date</p>
        <p className='p-5'>Amount</p>
        <p className='p-5'>Payment Method</p>
        <p className='p-5'>Status</p>
      </li>
      {invoices?.map((item) => (
        <li
          className='border-b border-purple-200/20 text-xs flex justify-between'
          key={item.id}
        >
          <p className='p-5'>
            {item.createdAt ? format(item.createdAt, 'MM-dd-yyyy') : ''}
          </p>
          <p className='p-5'>{item.amount}</p>
          <p className='p-5'>{item.paymentMethod}</p>
          <p className='p-5'>{item.paymentStatus.status}</p>
        </li>
      ))}
    </ul>
  );
}
