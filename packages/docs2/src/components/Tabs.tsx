"use client";

import React from "react";

import {
  Tabs as TabsShad,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TabsProps {
  children: React.ReactNode;
}

const labels = ["Preview", "Code"];

const Tabs: React.FC<TabsProps> = ({ children }) => {
  return (
    <TabsShad defaultValue="Preview" className="w-full h-full">
      <TabsList>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const label = labels[index];
            return <TabsTrigger value={label}>{label}</TabsTrigger>;
          }
          return null;
        })}
      </TabsList>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const label = labels[index];
          return (
            <TabsContent value={label}>
              <div className="p-8 rounded-xl border">{child}</div>
            </TabsContent>
          );
        }
        return null;
      })}
    </TabsShad>
  );
};

export default Tabs;
