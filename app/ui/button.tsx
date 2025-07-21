import { cn } from "@/app/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "flex justify-center rounded-lg text-white font-bold px-6 py-3",
        className,
      )}
    >
      {children}
    </button>
  );
}
