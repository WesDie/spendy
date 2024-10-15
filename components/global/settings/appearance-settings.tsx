"use client";

import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SettingsCard from "./elements/settings-card";
import { useTheme } from "next-themes";
import { useThemeContext } from "@/components/providers/theme-provider";

const colorThemes = [
  {
    name: "Default",
    light: "bg-zinc-500",
    dark: "bg-zinc-500",
  },
  {
    name: "Red",
    light: "bg-red-600",
    dark: "bg-red-600",
  },
  {
    name: "Orange",
    light: "bg-orange-600",
    dark: "bg-orange-600",
  },
  {
    name: "Yellow",
    light: "bg-yellow-400",
    dark: "bg-yellow-400",
  },
  {
    name: "Green",
    light: "bg-green-600",
    dark: "bg-green-600",
  },
  {
    name: "Rose",
    light: "bg-rose-600",
    dark: "bg-rose-600",
  },
  {
    name: "Gray",
    light: "bg-gray-900",
    dark: "bg-gray-900",
  },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { themeColor, setThemeColor } = useThemeContext();

  return (
    <SettingsCard title="Appearance" description="Change your appearance.">
      <Separator />
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex flex-col gap-1">
          <h4 className="text-md font-semibold">Color scheme</h4>
          <p className="text-sm text-muted-foreground">
            Change the color scheme of the platform.
          </p>
        </div>
        <Select defaultValue={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h4 className="text-md font-semibold">Theme</h4>
          <p className="text-sm text-muted-foreground">
            Change the theme of the platform.
          </p>
        </div>
        <RadioGroup
          defaultValue={themeColor}
          onValueChange={(value) => setThemeColor(value as ThemeColors)}
          className="flex flex-wrap gap-4 w-fit"
        >
          {colorThemes.map(({ name, light, dark }) => (
            <Label
              key={name}
              className={`flex flex-col items-center space-y-2 rounded-md cursor-pointer group`}
            >
              <RadioGroupItem value={name} id={name} className="sr-only" />
              <div
                className={`p-1 rounded-lg group-hover:bg-muted-foreground/40 transition-colors duration-300 ${
                  themeColor === name
                    ? `ring-2 ${
                        theme === "light" ? "ring-black" : "ring-white"
                      }`
                    : ""
                }`}
              >
                <div
                  className={`w-[150px] h-[75px] p-2 rounded-md ${
                    theme === "light" ? light : dark
                  }`}
                />
              </div>
              <span className="text-sm font-medium">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>
      <Separator />
      <div className="flex justify-between gap-2 h-9">
        <Label
          htmlFor="theme"
          className="text-muted-foreground my-auto font-normal"
        >
          These settings are applied globally and are saved locally.
        </Label>
      </div>
    </SettingsCard>
  );
}
