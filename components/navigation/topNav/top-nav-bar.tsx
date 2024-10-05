"use client";

import { Links } from "./links";
import { GroupSelector } from "./group-selector";
import { SearchInput } from "./search-input";
import { Profile } from "./profile";

export function TopNavBar() {
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <GroupSelector />
          <Links type="desktop" />
        </div>
        <div className="relative flex items-center gap-2">
          <SearchInput />
          <Profile />
        </div>
      </div>
      <div className="flex items-center justify-between py-2 px-4 border-b md:hidden">
        <Links type="mobile" />
      </div>
    </>
  );
}
