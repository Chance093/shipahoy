'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/clerk-react';

export default function SignInButtons() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <div className='flex gap-5'>
      <button
        onClick={() =>
          isSignedIn ? router.push('/user/dashboard') : router.push('sign-in')
        }
      >
        Log In
      </button>
      <button
        onClick={() =>
          isSignedIn ? router.push('/user/dashboard') : router.push('sign-up')
        }
      >
        Sign Up
      </button>
    </div>
  );
}
