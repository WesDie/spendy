import React from "react";
import { Button } from "@/components/ui/button";

interface ChartControlsProps {
  activeView: string;
  onViewChange: (view: string) => void;
  views: string[];
  names: string[];
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  activeView,
  onViewChange,
  views,
  names,
}) => (
  <div className="flex items-center space-x-2 mb-4">
    {views.map((view, index) => (
      <Button
        key={view}
        onClick={() => onViewChange(view)}
        variant={activeView === view ? "default" : "outline"}
      >
        {names[index]}
      </Button>
    ))}
  </div>
);
