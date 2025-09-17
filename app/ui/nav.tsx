"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { authClient } from "@/app/lib/auth-client";

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const profileCode = session?.user.profile_code;

  const links = [
    {
      name: "Links",
      href: "/links",
      icon: "/icon-links-header.svg",
      iconActive: "/icon-links-header-active.svg",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: "/icon-profile-details-header.svg",
      iconActive: "/icon-profile-details-header-active.svg",
    },
    {
      name: "Preview",
      href: `/${profileCode}`,
      icon: "/icon-preview-header.svg",
      iconActive: "/icon-preview-header.svg",
    },
  ];

  return (
    <nav className="md:hidden flex justify-between py-3">
      <div className="px-6 py-2">
        <Image
          src="/logo-devlinks-small.svg"
          height={24}
          width={24}
          alt="Dev Links Logo"
        ></Image>
      </div>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn("px-6 py-2", {
              "bg-purple-200 rounded-md": pathname === link.href,
            })}
          >
            <Image
              src={pathname === link.href ? link.iconActive : link.icon}
              height={24}
              width={24}
              alt={link.name}
            ></Image>
          </Link>
        );
      })}
    </nav>
  );
}
