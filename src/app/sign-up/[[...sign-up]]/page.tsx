import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Proglo Shipping",
  description: "Generated by create next app",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center">
      <SignUp />
    </main>
  );
}
