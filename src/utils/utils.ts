import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
};

import { notFound } from 'next/navigation';

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return [];
  }

  try {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    notFound();
  }

  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const metadata: Metadata = {
      title: data.title || "",
      publishedAt: data.publishedAt,
      summary: data.summary || "",
      image: data.image || "",
      images: data.images || [],
      tag: data.tag || [],
      team: data.team || [],
      link: data.link || "",
    };

    return { metadata, content };
  } catch (error) {
    console.error(`Error reading MDX file ${filePath}:`, error);
    notFound();
  }
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  if (mdxFiles.length === 0) {
    console.warn(`No MDX files found in: ${dir}`);
    return [];
  }

  return mdxFiles.map((file) => {
    try {
      const { metadata, content } = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));

      return {
        metadata,
        slug,
        content,
      };
    } catch (error) {
      console.error(`Error processing MDX file ${file}:`, error);
      return null;
    }
  }).filter(Boolean) as any[];
}

export function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  console.log('[getPosts] Looking for MDX files in:', postsDir);
  console.log('[getPosts] process.cwd():', process.cwd());
  console.log('[getPosts] __dirname equivalent:', __dirname || 'not available');
  console.log('[getPosts] Directory exists:', fs.existsSync(postsDir));

  const result = getMDXData(postsDir);
  console.log('[getPosts] Found', result.length, 'posts');

  if (result.length === 0) {
    console.error('[getPosts] WARNING: No posts found! This may cause empty carousels in production');
    console.error('[getPosts] Attempted path:', postsDir);
    console.error('[getPosts] CWD:', process.cwd());
    console.error('[getPosts] Files in CWD:', fs.existsSync(process.cwd()) ? fs.readdirSync(process.cwd()).slice(0, 10) : 'CWD not accessible');
  }

  return result;
}
