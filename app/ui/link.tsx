"use client";

import { UserLink } from "@/app/lib/types";
import {
  generateLink,
  getWebsiteClassName,
  cn,
  getWebsiteIcon,
} from "../lib/utils";
import Image from "next/image";

interface Props {
  link: UserLink;
}

export default function Link({ link }: Props) {
  const href = generateLink(link);
  const websiteClassName = getWebsiteClassName(link.website);
  const icon = getWebsiteIcon(link.website);

  const iconIsDark = link.website === "Frontend Mentor";

  return (
    <a href={href} target="_blank">
      <div
        className={cn("p-4 rounded-lg flex justify-between", websiteClassName)}
      >
        <div className="flex gap-2">
          <Image src={icon} height={16} width={16} alt="" aria-hidden />
          {link.website}
        </div>
        <Image
          src={
            iconIsDark ? "/icon-arrow-right-dark.svg" : "/icon-arrow-right.svg"
          }
          height={16}
          width={16}
          alt=""
          aria-hidden
        />
      </div>
    </a>
  );
}
