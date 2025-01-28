import fs from "fs";
import matter from "gray-matter";
import path from "path";

interface ArticleFileProps {
  name: string;
  type: string;
  path: string;
  children?: ArticleFileProps[];
}

interface ArticleProps {
  title: string;
  slug: string;
  category: string;
  url: string;
  path?: string[];
  fileName: string;
  content: string;
}

export const DOCS_PATH = path.join(process.cwd(), "src/docs");

export function getDocsTree(baseDir: string): ArticleFileProps[] {
  const readDir = (dir: string): ArticleFileProps[] => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    return items
      .map((item) => {
        const itemPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          return {
            name: item.name,
            type: "folder",
            path: itemPath,
            children: readDir(itemPath),
          };
        }
        if (item.isFile() && /\.(md|mdx)$/.test(item.name)) {
          return {
            name: item.name.replace(/\.(md|mdx)$/, ""), // remove file extension
            type: "file",
            path: itemPath,
          };
        }
        return null;
      })
      .filter(Boolean) as ArticleFileProps[];
  };

  return readDir(baseDir);
}

export function getContents(): ArticleProps[] {
  const files = getDocsTree(DOCS_PATH);
  return files
    .filter((file) => file.type === "file")
    .map((file) => {
      const fileContent = fs.readFileSync(file.path, "utf8");
      const { content, data: frontmatter } = matter(fileContent);

      const slug = frontmatter.slug || frontmatter.title || file.name;
      return {
        slug: slug,
        title: frontmatter.title || file.name,
        category: frontmatter.category || "Getting Started",
        path: frontmatter.path,
        url: `/${slug}`,
        fileName: file.path,
        content,
      };
    });
}
