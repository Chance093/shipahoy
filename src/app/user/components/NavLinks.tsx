"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  HomeIcon,
  CurrencyDollarIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/solid";
import { UserButton, useUser } from "@clerk/nextjs";

const links = [
  {
    name: "Dashboard",
    href: "/user/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Create Labels",
    href: "/user/create-labels",
    icon: DocumentArrowUpIcon,
  },
  {
    name: "Accounting",
    href: "/user/accounting",
    icon: CurrencyDollarIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      <nav className="text-test-gray mx-4 flex flex-col gap-1 border-b border-gray-600/50  py-8 text-lg">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              href={link.href}
              key={link.name}
              className={clsx(
                "hover:bg-test-purple hover:text-test-white group flex cursor-pointer items-center gap-4 rounded-lg p-3",
                {
                  "bg-test-purple text-test-white": pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p>{link.name}</p>
            </Link>
          );
        })}
      </nav>
      <div className="mx-6 flex flex-1 items-center gap-4 py-8">
        <UserButton />
        <p>{user ? user.fullName : ""}</p>
      </div>
    </>
  );
}
