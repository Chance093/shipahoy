import { UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className='h-16 flex justify-between items-center bg-gradientMiddle border-b-2 border-gradientEnd px-5'>
      <div>hamburger</div>
      <UserButton afterSignOutUrl='/' />
    </header>
  );
}
