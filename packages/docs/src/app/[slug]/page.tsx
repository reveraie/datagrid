import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { getContents } from "@/lib/readDocs";
import Example01 from "@/examples/example-01";
import BasicExample from "@/examples/BasicExample";

import rehypePrettyCode from "rehype-pretty-code";
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import ComfortExample from "@/examples/ComfortExample";
import ComprehensiveExample from "@/examples/ComprehensiveExample";
import GroupsExample from "@/examples/GroupsExample";
import TenThousandRowsExample from "@/examples/TenThousandRowsExample";

//https://github.com/hashicorp/next-mdx-remote

function ClientComponent() {
  return <div>Client Component</div>;
}

export async function generateStaticParams() {
  const contents = getContents();

  return contents
    .filter((article) => article.slug || article.title)
    .map((article) => ({
      slug: article.slug || article.title,
    }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const contents = getContents();
  const artcile = contents.find((article) => article.slug === slug);

  if (!artcile) {
    return (
      <>
        <h1>Not Found</h1>
      </>
    );
  }

  // Compile the MDX source code to a function body

  const code = String(
    await compile(artcile.content, {
      outputFormat: "function-body",
      rehypePlugins: [
        [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
      ],
    })
  );
  // You can then either run the code on the server, generating a server
  // component, or you can pass the string to a client component for
  // final rendering.

  // Run the compiled code with the runtime and get the default export
  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  // Render the MDX content, supplying the ClientComponent as a component
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3 w-full">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                {artcile.category}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{artcile.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grow"></div>
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-6 items-center">
        <div className="prose prose-lg dark:prose-invert w-full">
          <MDXContent
            components={{
              Tabs,
              Tab,
              Example01,
              ClientComponent,
              BasicExample,
              ComfortExample,
              ComprehensiveExample,
              GroupsExample,
              TenThousandRowsExample,
            }}
          />
        </div>
      </div>
    </>
  );
}
