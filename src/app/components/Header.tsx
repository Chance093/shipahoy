"use client";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  let header = "";
  if (pathname === "/user/dashboard") header = "Dashboard";
  if (pathname === "/user/create-labels") header = "Create Labels";
  if (pathname === "/user/accounting") header = "Accounting";
  if (pathname === "/user/duoplane") header = "Duoplane";

  return <h1 className="pl-2 text-4xl">{header}</h1>;
}
