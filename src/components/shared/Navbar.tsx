"use client";

import { usePathname } from "next/navigation";
import { HomeNavbar } from "@/components/home/HomeNavbar";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) return null;

  return <HomeNavbar />;
}
