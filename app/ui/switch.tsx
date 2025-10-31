import { useControl } from "@conform-to/react/future";
import { Switch as HeadlessUiSwitch, Field, Label } from "@headlessui/react";
import { cn } from "@/app/lib/utils";

export type Props = {
  name: string;
  value?: string;
  defaultChecked?: boolean;
};

export function Switch({ name, value, defaultChecked }: Props) {
  const control = useControl({ defaultChecked, value });

  return (
    <Field className="flex items-center">
      <Label className="text-grey-700 md:text-grey-500 text-[0.75rem] md:text-base mr-12">
        Show email
      </Label>
      <input
        type="checkbox"
        className="hidden"
        name={name}
        ref={control.register}
        hidden
      />
      <HeadlessUiSwitch
        checked={control.checked ?? false}
        onChange={(state) => control.change(state)}
        onBlur={() => control.blur()}
        className={cn(
          control.checked ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            control.checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          )}
        />
      </HeadlessUiSwitch>
    </Field>
  );
}
