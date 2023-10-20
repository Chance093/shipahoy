import { UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className='h-16 w-full flex justify-between fixed items-center bg-gradient-start border-b border-purple-200/20 px-5'>
      <div>E</div>
      <UserButton afterSignOutUrl='/' />
    </header>
  );
}
