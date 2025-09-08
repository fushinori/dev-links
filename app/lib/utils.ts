import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserLink } from "@/app/lib/types";

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
