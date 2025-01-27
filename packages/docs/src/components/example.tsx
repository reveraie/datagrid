import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import CodeBlock from "./code-block";
import { Children, JSX } from "react";
import CopyButton from "./copy-button";

interface ExampleProps {
    demo: JSX.Element;
    children: string;
}

export default function Example({ children, demo }: ExampleProps) {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        {demo}
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock lang="tsx" className="max-h-[650px]">{children}</CodeBlock>
      </TabsContent>
    </Tabs>
  );
}
