import { SignIn } from "@clerk/nextjs";

import { env } from "~/env.mjs";

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center">
      <SignIn afterSignInUrl={env.DOMAIN ? `https://${env.DOMAIN}/user/dashboard` : "http://localhost:3000/user/dashboard"} />
    </main>
  );
}
