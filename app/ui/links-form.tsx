"use client";

import { SecondaryButton } from "@/app/ui/button/button-secondary";
import { dummyLinks } from "@/app/lib/dummy_data";
import LinkListBox from "@/app/ui/link-listbox";
import { useState } from "react";

export default function LinksForm() {
  const [links, setLinks] = useState(dummyLinks);
  return (
    <form>
      <SecondaryButton className="w-full mb-6">+ Add new link</SecondaryButton>
      {links.map((link) => (
        <LinkListBox
          key={link.id}
          id={link.id}
          position={link.position}
          name={link.name}
          username={link.username}
        />
      ))}
    </form>
  );
}
