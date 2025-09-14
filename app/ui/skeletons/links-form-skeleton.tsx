import { SecondaryButton } from "@/app/ui/button/button-secondary";
import { LinkListBoxSkeleton } from "@/app/ui/skeletons/link-listbox-skeleton";

export default function LinksFormSkeleton() {
  return (
    <form noValidate>
      {/* Add new link button placeholder */}
      <SecondaryButton type="button" className="w-full mb-6" disabled>
        + Add new link
      </SecondaryButton>

      {/* Render 3 fake link boxes */}
      <LinkListBoxSkeleton />
      <LinkListBoxSkeleton />
      <LinkListBoxSkeleton />

      {/* Sticky save button placeholder */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-grey-300 border-t-[1px]">
        <div className="h-10 w-full bg-gray-300 rounded animate-pulse"></div>
      </div>
    </form>
  );
}
