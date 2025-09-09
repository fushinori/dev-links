import { z } from "zod";

const BaseSignUpSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Can't be empty"
        : "Please enter a valid email",
  }),
  password: z.string().min(8, "Password should be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password should be at least 8 characters long"),
});

export const LoginSchema = BaseSignUpSchema.omit({ confirmPassword: true });

// Add refinement to validate if both passwords match
export const SignUpSchema = BaseSignUpSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

// Possible websites
export const websites = [
  {
    id: 1,
    name: "GitHub",
    icon: "/icon-github.svg",
    prefix: "https://github.com/",
  },
  {
    id: 2,
    name: "Frontend Mentor",
    icon: "/icon-frontend-mentor.svg",
    prefix: "https://www.frontendmentor.io/profile/",
  },
  {
    id: 3,
    name: "Twitter",
    icon: "/icon-twitter.svg",
    prefix: "https://twitter.com/",
  },
  {
    id: 4,
    name: "LinkedIn",
    icon: "/icon-linkedin.svg",
    prefix: "https://www.linkedin.com/in/",
  },
  {
    id: 5,
    name: "YouTube",
    icon: "/icon-youtube.svg",
    prefix: "https://www.youtube.com/@",
  },
  {
    id: 6,
    name: "Facebook",
    icon: "/icon-facebook.svg",
    prefix: "https://www.facebook.com/",
  },
  {
    id: 7,
    name: "Twitch",
    icon: "/icon-twitch.svg",
    prefix: "https://www.twitch.tv/",
  },
  { id: 8, name: "Dev.to", icon: "/icon-devto.svg", prefix: "https://dev.to/" },
  {
    id: 9,
    name: "Codewars",
    icon: "/icon-codewars.svg",
    prefix: "https://www.codewars.com/users/",
  },
  {
    id: 10,
    name: "Codepen",
    icon: "/icon-codepen.svg",
    prefix: "https://codepen.io/",
  },
  {
    id: 11,
    name: "freeCodeCamp",
    icon: "/icon-freecodecamp.svg",
    prefix: "https://www.freecodecamp.org/",
  },
  {
    id: 12,
    name: "GitLab",
    icon: "/icon-gitlab.svg",
    prefix: "https://gitlab.com/",
  },
  {
    id: 13,
    name: "Hashnode",
    icon: "/icon-hashnode.svg",
    prefix: "https://hashnode.com/@",
  },
  {
    id: 14,
    name: "Stack Overflow",
    icon: "/icon-stack-overflow.svg",
    prefix: "https://stackoverflow.com/users/",
  },
] as const;

export type ValidWebsite = (typeof websites)[number]["name"];

export interface UserLink {
  id: number;
  website: ValidWebsite;
  username: string;
  position: number;
}

export interface BetterAuthErrorMessage {
  message: string;
  code: number;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 1024, height: 1024 };

export const ProfileSchema = z.object({
  image: z
    .file()
    .max(MAX_IMAGE_SIZE, "Image should not be larger than 2MB!")
    .mime(["image/png", "image/jpeg"], "Image should be either JPG or PNG!")
    // Make sure image resolution is between 200x200 and 1024x1024
    // https://www.codu.co/articles/validate-an-image-file-with-zod-jjhied8p
    .refine(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const meetsDimensions =
                img.width >= MIN_DIMENSIONS.width &&
                img.height >= MIN_DIMENSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height;
              resolve(meetsDimensions);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }),
      {
        message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`,
      },
    ),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Can't be empty"
        : "Please enter a valid email",
  }),
});
