import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

type Metadata = {
  title: string;
  title_es?: string;
  publishedAt: string;
  summary: string;
  summary_es?: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
};

import { notFound } from 'next/navigation';

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  try {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  } catch {
    return [];
  }
}

function readMDXFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const metadata: Metadata = {
      title: data.title || "",
      title_es: data.title_es || "",
      publishedAt: data.publishedAt,
      summary: data.summary || "",
      summary_es: data.summary_es || "",
      image: data.image || "",
      images: data.images || [],
      tag: data.tag || [],
      team: data.team || [],
      link: data.link || "",
    };

    return { metadata, content };
  } catch {
    notFound();
  }
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  if (mdxFiles.length === 0) {
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
    } catch {
      return null;
    }
  }).filter(Boolean) as any[];
}

export const getPosts = cache(function getPosts(customPath = ["", "", "", ""]) {
  const postsDir = path.join(process.cwd(), ...customPath);
  return getMDXData(postsDir);
});
