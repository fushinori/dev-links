"use client";

import { PrimaryButton } from "@/app/ui/button/button-primary";
import { SecondaryButton } from "@/app/ui/button/button-secondary";
import LinkListBox from "@/app/ui/link-listbox";
import { useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { UserLink, ValidWebsite } from "@/app/lib/types";
import { updatePositions, cn } from "@/app/lib/utils";
import { saveLinks } from "../lib/actions";
import Image from "next/image";

interface Props {
  initialLinks: UserLink[];
}

export default function LinksForm({ initialLinks }: Props) {
  const [links, setLinks] = useState(initialLinks);
  const bottomDiv = useRef<null | HTMLDivElement>(null);

  // Add sensors with delay of 100ms and tolerance of 5px
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);
      setLinks(updatePositions(arrayMove(links, oldIndex, newIndex)));
    }
  };

  const handleRemove = (id: number) => {
    setLinks((prevLinks) =>
      updatePositions(prevLinks.filter((link) => link.id !== id)),
    );
  };

  const handleAdd = () => {
    // Generate a temporary negative ID to avoid collisions with DB IDs
    const tempId = Date.now() * -1;

    const newLink: UserLink = {
      id: tempId,
      website: "GitHub",
      username: "",
      position: links.length + 1,
    };

    setLinks((prev) => [...prev, newLink]);

    // Scroll after DOM update
    setTimeout(() => {
      bottomDiv.current?.scrollIntoView({ behavior: "smooth" });
    }, 50); // Small delay ensures new link is rendered
  };

  const handleUsernameChange = (id: number, newUsername: string) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, username: newUsername } : link,
      ),
    );
  };

  const handleWebsiteChange = (id: number, newWebsite: ValidWebsite) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, website: newWebsite } : link,
      ),
    );
  };

  return (
    <>
      <form
        // Add some bottom padding if there are no links
        className={cn(links.length === 0 && "pb-24")}
        noValidate
        action={async (formData: FormData) => {
          // Get data from hidden input
          const linksJSON = formData.get("links") as string;
          const links: UserLink[] = JSON.parse(linksJSON);

          await saveLinks(links);
        }}
      >
        {/* Hidden input for server action */}
        <input type="hidden" name="links" value={JSON.stringify(links)} />

        <SecondaryButton
          type="button"
          className="w-full mb-6"
          onClick={handleAdd}
        >
          + Add new link
        </SecondaryButton>

        {/* Render only if there are links */}
        {links.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {links.map((link) => (
                <LinkListBox
                  key={link.id}
                  id={link.id}
                  position={link.position}
                  name={link.website}
                  username={link.username}
                  onRemove={handleRemove}
                  onUsernameChange={handleUsernameChange}
                  onWebsiteChange={handleWebsiteChange}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {/* Render if no links */}
        {links.length === 0 && <GetStarted />}

        <div className="bottomDiv" ref={bottomDiv}></div>
        <div className="fixed bottom-0 left-0 flex justify-end w-full p-4 md:p-6 bg-white border-grey-300 border-t-[1px]">
          <PrimaryButton className="w-full md:w-auto" type="submit">
            Save
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}

function GetStarted() {
  return (
    <section className="bg-grey-100 flex flex-col gap-6 items-center rounded-xl p-5 mt-6 md:p-20">
      <div className="w-32 md:w-60">
        <Image
          src="/illustration-empty.svg"
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          priority
          aria-hidden="true"
          className="w-full h-auto"
        />
      </div>
      <h2 className="text-grey-700 font-bold text-2xl md:text-3xl">
        Let&apos;s get you started
      </h2>
      <p className="text-grey-500 md:text-center">
        Use the &ldquo;Add new link&rdquo; button to get started. Once you have
        more than one link, you can reorder and edit them. We&rsquo;re here to
        help you share your profiles with everyone!
      </p>
    </section>
  );
}
