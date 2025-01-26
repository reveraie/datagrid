import { compile, run } from '@mdx-js/mdx'
import path from 'path';
import fs from 'fs';
import * as runtime from 'react/jsx-runtime'

//https://github.com/hashicorp/next-mdx-remote

function ClientComponent() {
    return (<div>Client Component</div>)
} 

// MDX can be retrieved from anywhere, such as a file or a database.
const mdxSource = `# Hello, world!
<ClientComponent />
`

export async function generateStaticParams() {
  const docsPath = path.join(process.cwd(), 'src/app/content');
  const files = fs.readdirSync(docsPath);

  // Generate parameters for all MDX files
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({
      slug: file.replace('.mdx', ''),
    }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Compile the MDX source code to a function body

  console.log(slug);
  const filePath = path.join(process.cwd(), 'src/app/content', `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const code = String(
    await compile(fileContent, { outputFormat: 'function-body' })
  )
  // You can then either run the code on the server, generating a server
  // component, or you can pass the string to a client component for
  // final rendering.

  // Run the compiled code with the runtime and get the default export
  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  // Render the MDX content, supplying the ClientComponent as a component
  return <MDXContent components={{ ClientComponent }} />
}