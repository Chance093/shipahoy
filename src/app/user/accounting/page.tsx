import { api } from '~/trpc/server';
import InvoiceTable from './components/InvoiceTable';

export default async function accounting() {
  const balance = await api.balance.getAmount.query();
  return (
    <main className='flex flex-col gap-6 px-5 py-7 ml-72 mt-16'>
      <h1 className='heading pl-2'>Accounting</h1>
      <section className='flex gap-12'>
        <section className='h-32 flex flex-col flex-1 justify-between card p-5'>
          <p className='font-bold'>Balance</p>
          <p className='text-4xl'>$ {balance ? balance.amount : '0.00'}</p>
        </section>
      </section>
      <section className='flex flex-col gap-6'>
        <h2 className='subheading pl-2'>Invoices</h2>
        <InvoiceTable />
      </section>
    </main>
  );
}
