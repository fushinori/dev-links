import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserLink, ValidWebsite, websites } from "@/app/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function updatePositions(links: UserLink[]): UserLink[] {
  return links.map((link, index) => ({
    ...link,
    position: index + 1, // positions start at 1
  }));
}

export async function sendMockEmail(email: string, url: string) {
  console.log(`Email: ${email}\nURL: ${url}`);
}

const prefixMap: Record<ValidWebsite, string> = Object.fromEntries(
  websites.map((w) => [w.name, w.prefix]),
) as Record<ValidWebsite, string>;

export function generateLink(userLink: UserLink): string {
  return `${prefixMap[userLink.website]}${userLink.username}`;
}

const websiteBgMap: Record<string, string> = {
  github: "bg-github",
  frontendmentor: "bg-frontendmentor text-black border-[1px] border-grey-300",
  twitter: "bg-twitter",
  linkedin: "bg-linkedin",
  youtube: "bg-youtube",
  facebook: "bg-facebook",
  twitch: "bg-twitch",
  devto: "bg-devto",
  codewars: "bg-codewars",
  freecodecamp: "bg-freecodecamp",
  codepen: "bg-codepen",
  gitlab: "bg-gitlab",
  hashnode: "bg-hashnode",
  stackoverflow: "bg-stackoverflow",
};

export function getWebsiteClassName(name: string): string {
  const sanitizedName = name.replace(/[\s.]/g, "").toLowerCase();
  return websiteBgMap[sanitizedName] || "bg-black-400";
}

export function getWebsiteIcon(name: string): string {
  const sanitizedName = name.replace(/[\s.]/g, "").toLowerCase();
  return `/preview/${sanitizedName}.svg`;
}
