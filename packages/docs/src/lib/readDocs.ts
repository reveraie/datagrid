import fs from "fs";
import path from "path";
import { title } from "process";

export function getDocsTree(baseDir: string) {
  const readDir = (dir: string): any => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    return items
      .map((item) => {
        const itemPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          return {
            name: item.name,
            type: "folder",
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
      .filter(Boolean);
  };

  return readDir(baseDir);
}

export function getContents(baseDir: string) {
  const files = getDocsTree(baseDir);
  return files.map((file) => {
    return {
      title: file.name,
      url: `content/${file.name}`,
    }
  });
}
