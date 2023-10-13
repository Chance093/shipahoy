'use client';

import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <main className='flex flex-col gap-6 px-5 py-7 '>
      <h1 className='text-xl font-bold'>Welcome Back, {user?.firstName}!</h1>
      <section className='h-32 flex flex-col justify-between bg-gradientEnd p-5 rounded-md'>
        <p className='font-bold'>Balance</p>
        <p className='text-4xl'>$0.00</p>
      </section>
      <section className='flex flex-col gap-6'>
        <h2 className='font-bold'>Shipping History</h2>

        <div className='w-full rounded-md bg-gradientEnd overflow-x-scroll'>
          <table className='bg-gradientEnd border-collapse text-left overflow-x-scroll'>
            <thead>
              <tr className='border-b-2'>
                <th className='p-5'>Invoice#</th>
                <th className='p-5'>Date</th>
                <th className='p-5'>To</th>
                <th className='p-5'>From</th>
                <th className='p-5'>Size</th>
                <th className='p-5'>Type</th>
                <th className='p-5'>Tracking</th>
                <th className='p-5'>Price</th>
                <th className='p-5'>Files</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b-2 text-xs'>
                <td className='p-5'>PG0001</td>
                <td className='p-5'>10/11/2023</td>
                <td className='p-5'>Bigho Schlung</td>
                <td className='p-5'>Pwoss Iboy</td>
                <td className='p-5'>200</td>
                <td className='p-5'>Priority</td>
                <td className='p-5'>757647767976545648764765</td>
                <td className='p-5'>$420.69</td>
                <td className='p-5'>^</td>
              </tr>
              <tr className='border-b-2 text-xs'>
                <td className='p-5'>PG0001</td>
                <td className='p-5'>10/11/2023</td>
                <td className='p-5'>Bigho Schlung</td>
                <td className='p-5'>Pwoss Iboy</td>
                <td className='p-5'>200</td>
                <td className='p-5'>Priority</td>
                <td className='p-5'>757647767976545648764765</td>
                <td className='p-5'>$420.69</td>
                <td className='p-5'>^</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
