"use client";

import Image from "next/image";
import {
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { websites } from "@/app/lib/types";

interface Props {
  position: number;
}

export default function LinkListBox({ position }: Props) {
  const [selectedWebsite, setSelectedWebsite] = useState(websites[0]);

  return (
    <Fieldset className="w-full bg-grey-100 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Image src="/icon-drag-and-drop.svg" alt="" height={16} width={16} />
          <Legend className="font-bold text-grey-500">Link #{position}</Legend>
        </div>
        <button className="text-grey-500 cursor-pointer">Remove</button>
      </div>

      <Field>
        <Label className="text-grey-700 text-xs block mb-1">Platform</Label>
        <Listbox value={selectedWebsite} onChange={setSelectedWebsite}>
          <ListboxButton className="group flex justify-between rounded-lg bg-white w-full py-3 px-4 text-grey-700 outline-none border border-grey-300 focus:border-purple-400 data-open:border-purple-400 focus:shadow-lg/65 focus:shadow-grey-300">
            <div className="flex gap-2">
              <Image src={selectedWebsite.icon} alt="" height={16} width={16} />
              <span>{selectedWebsite.name}</span>
            </div>
            <Image
              src="/icon-chevron-down.svg"
              className="transition-transform duration-200 group-data-open:rotate-180"
              alt=""
              height={16}
              width={16}
            />
          </ListboxButton>
          <ListboxOptions
            anchor={{ gap: 16, to: "bottom" }}
            className="w-(--button-width) p-3 bg-white outline-none border border-grey-300 rounded-lg"
          >
            {websites.map((website) => (
              <ListboxOption
                key={website.id}
                value={website}
                className="text-gray-500 data-focus:text-purple-400 data-selected:text-purple-400 cursor-pointer"
              >
                <div className="flex gap-2 items-center">
                  {/*Website icon 
                We're using mask image to get the current text-color to change the icon color on focus or select*/}
                  <div
                    className="h-4 w-4 bg-current"
                    style={{
                      WebkitMaskImage: `url(${website.icon})`,
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      WebkitMaskSize: "contain",
                      maskImage: `url(${website.icon})`,
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      maskSize: "contain",
                    }}
                  />
                  <span>{website.name}</span>
                </div>

                {/* Divider */}
                <div className="border-b-[1px] border-grey-300 my-3"></div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </Field>

      <Field>
        <Label className="text-grey-700 text-xs block mb-1">Link</Label>
        <Input
          type="url"
          className="rounded-lg bg-white w-full py-3 px-4 text-grey-700 outline-none border border-grey-300 focus:border-purple-400 focus:shadow-lg/65 focus:shadow-grey-300"
          placeholder="https://github.com/fushinori"
        />
      </Field>
    </Fieldset>
  );
}
