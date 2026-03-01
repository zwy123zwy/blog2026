/**
 * 将所有文章 frontmatter 中的 published 更新为文件的修改日期（YYYY-MM-DD）
 */
import fs from "fs";
import path from "path";

const postsDir = "./src/content/posts";

function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAllMdFiles(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      getAllMdFiles(full, list);
    } else if (e.isFile() && /\.md$/i.test(e.name)) {
      list.push(full);
    }
  }
  return list;
}

const files = getAllMdFiles(postsDir);
let updated = 0;

for (const filePath of files) {
  const stat = fs.statSync(filePath);
  const mtime = stat.mtime;
  const newDate = formatDate(mtime);

  let content = fs.readFileSync(filePath, "utf-8");
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) continue;

  const block = frontmatterMatch[0];
  const hasPublished = /^published:\s*.+$/m.test(frontmatterMatch[1]);
  if (!hasPublished) continue;

  const newBlock = block.replace(
    /^published:\s*.+$/m,
    `published: ${newDate}`
  );
  content = content.replace(block, newBlock);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`${path.relative(postsDir, filePath)} → published: ${newDate}`);
  updated++;
}

console.log(`Done. Updated ${updated} file(s).`);
