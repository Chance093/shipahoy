import NavLinks from "./NavLinks";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/solid";

export default function Sidebar() {
  return (
    <aside className="bg-test-secondary fixed left-0 top-0 h-screen w-72">
      <h1 className="mx-4 flex items-center gap-2 border-b border-gray-600/50 py-4 text-2xl">
        <GlobeAsiaAustraliaIcon className="w-12" />
        Proglo Shipping
      </h1>
      <NavLinks />
    </aside>
  );
}
