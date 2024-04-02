import NavLinks from "./NavLinks";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-secondary">
      <Link href="/user/dashboard">
        <h1 className="mx-4 flex items-center gap-2 border-b border-gray-600/50 py-4 text-2xl">
          <GlobeAsiaAustraliaIcon className="w-12" />
          Proglo Shipping
        </h1>
      </Link>
      <NavLinks />
    </aside>
  );
}
