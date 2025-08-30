import { ValidWebsite } from "@/app/lib/types"; // union type from your websites array

export const dummyLinks: {
  id: number;
  position: number;
  name: ValidWebsite;
  username: string;
}[] = [
  { id: 1, position: 1, name: "GitHub", username: "fushinori" },
  { id: 2, position: 2, name: "Frontend Mentor", username: "fushinori" },
  { id: 3, position: 3, name: "Twitter", username: "fushinori" },
  { id: 4, position: 4, name: "LinkedIn", username: "fushinori" },
  { id: 5, position: 5, name: "YouTube", username: "fushinori" },
];
