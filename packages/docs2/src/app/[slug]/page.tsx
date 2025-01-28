import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { getContents } from "@/lib/readDocs";
import Example01 from "@/examples/example-01";

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
      <div className="prose">
        <MDXContent
          components={{
            Example01,
            ClientComponent,
          }}
        />
      </div>
    </>
  );
}
