"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Sun, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import AppearanceSettings from "@/components/global/settings/appearance-settings";
import ProfileSettings from "@/components/global/settings/profile-settings";
import NotificationSettings from "@/components/global/settings/notification-settings";
import AccountSettings from "@/components/global/settings/account-settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: User },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <main className="flex flex-col gap-6 h-full w-full p-6 px-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="flex">
        <div className="w-64">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                className={`w-full justify-start hover:bg-secondary/50 ${
                  activeTab === tab.id
                    ? "bg-secondary/75 hover:bg-secondary/75"
                    : ""
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex-1 flex-col flex px-8 gap-4">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
        </div>
      </div>
    </main>
  );
}
