import { UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className='h-16 flex justify-between items-center bg-heading/5 border-b-2 border-purple-200/10 px-5'>
      <div>hamburger</div>
      <UserButton afterSignOutUrl='/' />
    </header>
  );
}
