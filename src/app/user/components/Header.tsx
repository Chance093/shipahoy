import { UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header>
      <div>hamburger</div>
      <UserButton afterSignOutUrl='/' />
    </header>
  );
}
