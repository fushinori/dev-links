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
    <>
      {/* Mobile Nav*/}
      <nav className="md:hidden flex justify-between py-3">
        <div className="px-6 py-2">
          <Image
            src="/logo-devlinks-small.svg"
            height={24}
            width={24}
            alt="Dev Links Logo"
          ></Image>
        </div>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn("px-6 py-2 flex items-center", {
              "bg-purple-200 rounded-md": pathname === link.href,
            })}
          >
            <Image
              src={pathname === link.href ? link.iconActive : link.icon}
              height={0}
              width={0}
              sizes="100vw"
              className="w-5 h-auto"
              alt={link.name}
            ></Image>
          </Link>
        ))}
      </nav>

      {/* Tablet and Desktop Nav*/}
      <nav className="hidden md:flex justify-between items-center px-6 py-6 md:bg-white md:rounded-xl md:m-6">
        <div>
          <Image
            src="/logo-devlinks-large.svg"
            height={32}
            width={146}
            alt="Dev Links Logo"
          ></Image>
        </div>

        {/* Links and Profile */}
        <div className="flex">
          {links
            .filter((link) => link.name !== "Preview")
            .map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn("flex gap-1.5 px-7 py-3 group", {
                  "bg-purple-200 rounded-md": pathname === link.href,
                })}
              >
                <Image
                  src={pathname === link.href ? link.iconActive : link.icon}
                  height={0}
                  width={0}
                  sizes="100vw"
                  className="w-5 h-auto"
                  alt=""
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-grey-500 font-semibold group-hover:text-purple-400",
                    pathname === link.href && "text-purple-400",
                  )}
                >
                  {link.name}
                </span>
              </Link>
            ))}
        </div>

        {/* Preview */}
        <Link
          href={`/${profileCode}`}
          className="flex justify-center rounded-lg px-7 py-3 text-purple-400 font-semibold border-purple-400 border cursor-pointer hover:bg-purple-200"
        >
          Preview
        </Link>
      </nav>
    </>
  );
}
