import { compile, run } from "@mdx-js/mdx";
import path from "path";
import fs from "fs";
import * as runtime from "react/jsx-runtime";
import matter from "gray-matter";
import { DOCS_PATH, getContents } from "@/src/lib/readDocs";
import { SidebarTrigger } from "@/src/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import Example01 from "@/src/examples/Example01";
import Example02 from "@/src/examples/Example02";
import BasicExample from "@/src/examples/BasicExample";
import CodeBlock from "@/src/components/code-block";
import Example from "@/src/components/example";
import TenThousandRowsExample from "@/src/examples/TenThousandRowsExample";

//https://github.com/hashicorp/next-mdx-remote

function ClientComponent() {
  return <div>Client Component</div>;
}

// MDX can be retrieved from anywhere, such as a file or a database.
const mdxSource = `# Hello, world!
<ClientComponent />
`;

export async function generateStaticParams() {
  const files = fs.readdirSync(DOCS_PATH);

  const contents = getContents();

  return contents
    .filter((article) => article.slug || article.title)
    .map((article) => ({
      slug: article.slug || article.title,
    }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;

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
    await compile(artcile.content, { outputFormat: "function-body" })
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
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <Breadcrumb>
            <BreadcrumbList>
              {artcile.path &&
                artcile.path.map((item, index) => {
                  return (
                    <>
                      <BreadcrumbItem
                        className="hidden md:block"
                      >
                        <BreadcrumbLink href="#">{item}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator
                        className="hidden md:block"
                      />
                    </>
                  );
                })}
              <BreadcrumbItem key={"end"}>
                <BreadcrumbPage>{artcile.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="prose">
        <MDXContent
          components={{
            Example,
            ClientComponent,
            Example01,
            Example02,
            BasicExample,
            TenThousandRowsExample,
            CodeBlock,
          }}
        />
      </div>
    </>
  );
}
