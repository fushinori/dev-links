import { cn } from "@/app/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "flex justify-center rounded-lg px-6 py-3 bg-purple-400 text-white font-bold cursor-pointer hover:bg-purple-300 focus:bg-purple-300 focus:shadow-lg/50 focus:shadow-purple-300 hover:shadow-lg/50 hover:shadow-purple-300 outline-none",
        className,
      )}
    >
      {children}
    </button>
  );
}
