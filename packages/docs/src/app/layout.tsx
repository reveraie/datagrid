import type { Metadata } from "next";
import "./globals.css";

import { AppSidebar } from "@/src/components/app-sidebar";
// import { Separator } from "@/src/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/components/ui/sidebar";
import { getContents } from "@/src/lib/readDocs";

export const metadata: Metadata = {
  title: "Reveraie DataGrid",
  description: "React Data Grid Component",
};

export default function Page({ children }: { children: React.ReactNode }) {
  const menu = getContents();

  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>
      <body className={`antialiased`}>
        <SidebarProvider>
          <AppSidebar menu={menu} />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
