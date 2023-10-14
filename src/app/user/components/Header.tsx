import { UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className='h-16 flex justify-between items-center bg-heading/5 border-b border-purple-200/20 px-5'>
      <div>hamburger</div>
      <UserButton afterSignOutUrl='/' />
    </header>
  );
}
