"use client";

import { Links } from "./links";
import { AccountSelector } from "./account-selector";
import { SearcInput } from "./search-input";
import { Profile } from "./profile";

export function TopNavBar() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <AccountSelector />
        <Links />
      </div>
      <div className="relative flex items-center gap-2">
        <SearcInput />
        <Profile />
      </div>
    </div>
  );
}
