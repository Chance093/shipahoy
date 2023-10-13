import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className='h-screen flex justify-center items-center'>
      <SignIn afterSignInUrl={'http://localhost:3000/user/dashboard'} />
    </main>
  );
}
