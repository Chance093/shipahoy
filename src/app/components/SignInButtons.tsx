"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/clerk-react";

export default function SignInButtons() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <div className="flex gap-5">
      <button
        onClick={() =>
          isSignedIn ? router.push("/user/dashboard") : router.push("sign-up")
        }
        className="w-40 cursor-pointer items-start rounded-md bg-[#b4a3d8] p-4 text-center text-black"
      >
        Sign Up
      </button>
      <button
        onClick={() =>
          isSignedIn ? router.push("/user/dashboard") : router.push("sign-in")
        }
        className="w-40 cursor-pointer items-start rounded-md bg-purple p-4 text-center"
      >
        Log In
      </button>
    </div>
  );
}
