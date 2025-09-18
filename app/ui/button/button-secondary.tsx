import { cn } from "@/app/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SecondaryButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "flex justify-center rounded-lg px-6 py-3 text-purple-400 font-semibold border-purple-400 border cursor-pointer hover:bg-purple-200",
        className,
      )}
    >
      {children}
    </button>
  );
}
