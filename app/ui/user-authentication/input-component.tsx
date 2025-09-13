import { cn } from "@/app/lib/utils";
import Image from "next/image";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  errors?: string[];
}

export default function Input({
  icon,
  errors,
  className,
  ...rest
}: InputProps) {
  return (
    <div className="relative">
      <input
        className={cn(
          "outline-none w-full border-grey-300 border-[1px] rounded-lg px-4 py-3 placeholder:text-grey-500 pl-10 focus:border-purple-400 focus:shadow-lg/65 focus:shadow-grey-300",
          className,
        )}
        {...rest}
      />
      {icon && (
        <Image
          className="absolute top-[16px] left-[16px]"
          src={icon}
          width={16}
          height={16}
          alt=""
          aria-hidden={true}
        ></Image>
      )}
      <div>{errors && errors[0]}</div>
    </div>
  );
}
