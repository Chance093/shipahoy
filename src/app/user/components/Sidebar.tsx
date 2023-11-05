import { UserButton } from "@clerk/nextjs";
import NavLinks from "./NavLinks";

export default function Sidebar() {
  return (
    <aside className="bg-test-secondary fixed left-0 top-0 h-screen w-72">
      <h1>Proglo Shipping</h1>
      <NavLinks />
      <UserButton />
    </aside>
  );
}
