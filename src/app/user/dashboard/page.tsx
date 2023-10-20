import { serverClient } from '@/lib/trpc/server';
import ShippingHistoryTable from './components/ShippingHistoryTable';

export default async function Dashboard() {
  const balance = await serverClient.balance.getBalance();
  const shippingHistory = await serverClient.labelGroup.getShippingHistory();

  let totalLabels = 0;
  shippingHistory?.map((item) => (totalLabels += item.label_group.labelCount));

  return (
    <main className='flex flex-col gap-6 px-5 py-7 ml-72 mt-16'>
      <h1 className='heading pl-2'>Welcome Back!</h1>
      <section className='flex gap-12'>
        <section className='h-32 flex flex-col flex-1 justify-between card p-5'>
          <p className='font-bold'>Labels</p>
          <p className='text-4xl'>{totalLabels}</p>
        </section>
        <section className='h-32 flex flex-col flex-1 justify-between card p-5'>
          <p className='font-bold'>Balance</p>
          <p className='text-4xl'>$ {balance ? balance[0].amount : '0.00'}</p>
        </section>
      </section>
      <section className='flex flex-col gap-6'>
        <h2 className='subheading pl-2'>Shipping History</h2>
        <ShippingHistoryTable shippingHistory={shippingHistory} />
      </section>
    </main>
  );
}
