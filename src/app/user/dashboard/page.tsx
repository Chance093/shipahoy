import { serverClient } from '@/lib/trpc/server';
import {format} from 'date-fns';


export default async function Dashboard() {
  const balance = await serverClient.balance.getBalance();
  const shippingHistory = await serverClient.labelGroup.getShippingHistory();

  let totalLabels = 0;
  shippingHistory?.map( item => totalLabels += item.label_group.labelCount)

  return (
    <main className='flex flex-col gap-6 px-5 py-7 '>
      <h1 className='heading pl-2'>Welcome Back!</h1>
      <section className='h-32 flex flex-col justify-between card p-5'>
        <p className='font-bold'>Labels</p>
        <p className='text-4xl'>{totalLabels}</p>
      </section>
      <section className='h-32 flex flex-col justify-between card p-5'>
        <p className='font-bold'>Balance</p>
        <p className='text-4xl'>$ {balance ? balance[0].amount : '0.00'}</p>
      </section>
      <section className='flex flex-col gap-6'>
        <h2 className='subheading pl-2'>Shipping History</h2>

        <div className='w-full card overflow-x-scroll'>
          <table className='border-collapse text-left overflow-x-scroll'>
            <thead>
              <tr className='border-b border-purple-200/20'>
                <th className='p-5'>#</th>
                <th className='p-5'>Date</th>
                <th className='p-5'>Size</th>
                <th className='p-5'>Type</th>
                <th className='p-5'>Price</th>
                <th className='p-5'>Files</th>
              </tr>
            </thead>

            <tbody>
              {shippingHistory?.map((item) => (
                <>
                  <tr
                    className='border-b border-purple-200/20 text-xs whitespace-nowrap'
                    key={item.label_group.id}
                  >
                    <td className='p-5'>{item.invoice.id}</td>
                    <td className='p-5'>{format(item.invoice.createAt!, 'MM-dd-yyyy')}</td>
                    <td className='p-5'>{item.label_group.labelCount}</td>
                    <td className='p-5'>{item.usps_service.service}</td>
                    <td className='p-5'>${item.invoice.totalPrice}</td>
                    <td className='p-5'>^</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
