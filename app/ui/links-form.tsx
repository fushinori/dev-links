"use client";

import { SecondaryButton } from "@/app/ui/button/button-secondary";
import { dummyLinks } from "@/app/lib/dummy_data";
import LinkListBox from "@/app/ui/link-listbox";
import { useState } from "react";
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

export default function LinksForm() {
  const [links, setLinks] = useState(dummyLinks);

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
      setLinks(arrayMove(links, oldIndex, newIndex));
    }
  };

  const handleRemove = (id: number) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  return (
    <form>
      <SecondaryButton className="w-full mb-6">+ Add new link</SecondaryButton>
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
              name={link.name}
              username={link.username}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
    </form>
  );
}
