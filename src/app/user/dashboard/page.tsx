import { UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  return (
    <main>
      <div>Dashboard</div>
      <UserButton afterSignOutUrl='/' />
    </main>
  );
}
