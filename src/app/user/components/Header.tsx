'use client';
import { UserButton } from '@clerk/nextjs';
import Sidebar from './Sidebar';

export default function Header() {
  return (
    <header className='h-16 w-full flex justify-between fixed top-0 items-center bg-gradient-start border-b border-purple-200/20 px-5'>
      <div>E</div>
      <UserButton afterSignOutUrl='/' />
      <Sidebar />
    </header>
  );
}
