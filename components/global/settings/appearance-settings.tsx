"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import SettingsCard from "./elements/settings-card";
import { useTheme } from "next-themes";

type ColorTheme = "red" | "blue" | "yellow";
const colorThemes: { [key in ColorTheme]: string } = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};

export default function AppearanceSettings() {
  const [selectedColor, setSelectedColor] = useState<ColorTheme>("blue");
  const { theme, setTheme } = useTheme();

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
            <SelectItem value="system">System</SelectItem>
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
          defaultValue={selectedColor}
          onValueChange={(value) => setSelectedColor(value as ColorTheme)}
          className="grid grid-cols-3 gap-4 w-fit"
        >
          {Object.entries(colorThemes).map(([color, bgClass]) => (
            <Label
              key={color}
              className={`flex flex-col items-center space-y-2 rounded-md cursor-pointer`}
            >
              <RadioGroupItem value={color} id={color} className="sr-only" />
              <div
                className={`p-1 rounded-lg ${
                  selectedColor === color ? "ring-2 ring-primary" : ""
                }`}
              >
                <div
                  className={`w-[200px] h-[100px] p-2 rounded-md ${bgClass}`}
                />
              </div>
              <span className="text-sm font-medium">
                {color.charAt(0).toUpperCase() + color.slice(1)}
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
          Update your appearance settings.
        </Label>
        <Button className="w-fit">Update appearance</Button>
      </div>
    </SettingsCard>
  );
}
