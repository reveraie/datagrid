import GroupsExample from "@/examples/GroupsExample";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-6 pb-10 gap-8 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Reveraie DataGrid
        </h1>

        <div>
          <GroupsExample />
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row w-full justify-center">
          <Link
            className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/Installation"
            rel="noopener noreferrer"
          >
            Get Started
          </Link>
          <Link
            className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/Introduction"
            rel="noopener noreferrer"
          >
            Read our docs
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/reveraie/datagrid"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          Source
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/basic"
          rel="noopener noreferrer"
        >
          Examples
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://reveraie.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to reveraie.com →
        </Link>
      </footer>
    </div>
  );
}
