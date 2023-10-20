import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className='h-screen w-72 bg-gradient-start fixed top-0 left-0 border-r border-purple-200/20'>
      <nav className='m-12 mt-32 text-xl'>
        <ul className='flex flex-col gap-5'>
          <li className='cursor-pointer hover:text-purple-800'>
            <Link href='/user/dashboard'>Dashboard</Link>
          </li>
          <li className='cursor-pointer hover:text-purple-800'>
            <Link href='/user/create-labels'>Create Label</Link>
          </li>
          <li className='cursor-pointer hover:text-purple-800'>
            <Link href='/user/accounting'>Accounting</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
