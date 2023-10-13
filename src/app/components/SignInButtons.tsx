'use client';

import { useRouter } from 'next/navigation';

export default function SignInButtons() {
  const router = useRouter();

  return (
    <div className='flex gap-5'>
      <button onClick={() => router.push('/sign-in')}>Log In</button>
      <button onClick={() => router.push('/sign-up')}>Sign Up</button>
    </div>
  );
}
