import { SecondaryButton } from "@/app/ui/button/button-secondary";
import LinkListBox from "@/app/ui/link-listbox";

export default function Links() {
  return (
    <main className="p-4 bg-grey-100">
      <div className="bg-white p-6 rounded-sm">
        <h1 className="font-bold text-2xl text-grey-700 mb-2">
          Customize your links
        </h1>
        <p className="text-grey-500 mb-10">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>
        <SecondaryButton className="w-full mb-6">
          + Add new link
        </SecondaryButton>
        <LinkListBox position={1} />
      </div>
    </main>
  );
}
