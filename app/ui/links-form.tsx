"use client";

import { PrimaryButton } from "@/app/ui/button/button-primary";
import { SecondaryButton } from "@/app/ui/button/button-secondary";
import LinkListBox from "@/app/ui/link-listbox";
import { useEffect, useRef, useState } from "react";
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
import { authClient } from "@/app/lib/auth-client";
import { UserLink, ValidWebsite } from "@/app/lib/types";
import { updatePositions } from "@/app/lib/utils";
import { saveLinks } from "../lib/actions";

export default function LinksForm() {
  const { data: session, isPending } = authClient.useSession();

  const [userId, setUserId] = useState<string | null>(null);
  const [links, setLinks] = useState<UserLink[]>([]);
  const bottomDiv = useRef<null | HTMLDivElement>(null);

  // Wait for session to load
  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  //Fetch initial links
  useEffect(() => {
    if (!userId) return;

    const fetchLinks = async () => {
      try {
        const res = await fetch(`/api/links?userid=${userId}`);
        if (!res.ok) {
          setLinks([]); // fallback on error
          return;
        }

        const data: UserLink[] = await res.json();
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch links", error);
        setLinks([]); // fallback if fetch throws
      }
    };

    fetchLinks();
  }, [userId]);

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

  // Render loading state until we have a valid userId
  if (isPending || !userId) return <div>Loading...</div>;

  return (
    <>
      <form
        noValidate
        action={async (formData: FormData) => {
          // Get data from hidden inputs
          const userId = formData.get("userId") as string;
          const linksJSON = formData.get("links") as string;
          const links: UserLink[] = JSON.parse(linksJSON);

          await saveLinks(userId, links);
        }}
      >
        {/* Hidden inputs for server action */}
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="links" value={JSON.stringify(links)} />

        <SecondaryButton
          type="button"
          className="w-full mb-6"
          onClick={handleAdd}
        >
          + Add new link
        </SecondaryButton>
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
        <div className="bottomDiv" ref={bottomDiv}></div>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-grey-300 border-t-[1px]">
          <PrimaryButton className="w-full" type="submit">
            Save
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
