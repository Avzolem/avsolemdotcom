import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeadingLink } from "./HeadingLink";
import { CopyButton } from "./CopyButton";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className="text-cyan-600 dark:text-cyan-400 hover:underline"
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className="text-cyan-600 dark:text-cyan-400 hover:underline" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan-600 dark:text-cyan-400 hover:underline"
      {...props}
    >
      {children}
    </a>
  );
}

interface MediaProps {
  alt?: string;
  src: string;
}

function createImage({ alt, src, ...props }: MediaProps) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <div className="mt-2 mb-4 relative border border-gray-200/50 dark:border-gray-700/50 rounded-lg overflow-hidden">
      <div style={{ aspectRatio: '16 / 9' }} className="relative">
        <Image
          src={src}
          alt={alt || "Image"}
          fill
          sizes="(max-width: 960px) 100vw, 960px"
          className="object-cover"
          {...props}
        />
      </div>
    </div>
  );
}
createImage.displayName = 'MDXImage';

function slugify(str: any): string {
  const text = typeof str === 'string' ? str : String(str || '');
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({ children, ...props }: { children: ReactNode }) => {
    const slug = slugify(children);
    return (
      <HeadingLink
        as={as}
        id={slug}
        className="mt-6 mb-3"
        {...props}
      >
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

interface TextProps {
  children: ReactNode;
}

function createParagraph({ children }: TextProps) {
  // Check if children contains only an image (to avoid <div> inside <p> hydration error)
  if (React.Children.count(children) === 1) {
    const child = React.Children.toArray(children)[0];
    if (React.isValidElement(child) && (child.type as any)?.displayName === 'MDXImage') {
      return <>{children}</>;
    }
  }

  return (
    <p
      className="text-base text-gray-600 dark:text-gray-300 mt-2 mb-3 leading-relaxed"
      style={{ lineHeight: "175%" }}
    >
      {children}
    </p>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
      {children}
    </code>
  );
}

function createCodeBlock(props: any) {
  // For pre tags that contain code blocks
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;

    // Extract language from className (format: language-xxx)
    const language = className.replace('language-', '');
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <div className="mt-2 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{label}</span>
          <CopyButton text={children} />
        </div>
        <pre className="p-4 overflow-x-auto bg-gray-50 dark:bg-gray-900">
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{children}</code>
        </pre>
      </div>
    );
  }

  // Fallback for other pre tags or empty code blocks
  return (
    <pre className="mt-2 mb-4 p-4 rounded-lg overflow-x-auto bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" {...props} />
  );
}

// Custom components
function Text({ children, variant, ...props }: { children: ReactNode; variant?: string; [key: string]: any }) {
  const variantClasses: Record<string, string> = {
    'body-default-m': 'text-base text-gray-600 dark:text-gray-300',
    'body-default-s': 'text-sm text-gray-600 dark:text-gray-300',
    'body-default-l': 'text-lg text-gray-600 dark:text-gray-300',
    'heading-strong-m': 'text-lg font-semibold text-gray-900 dark:text-white',
    'heading-strong-l': 'text-xl font-semibold text-gray-900 dark:text-white',
  };

  return (
    <span className={variantClasses[variant || 'body-default-m']} {...props}>
      {children}
    </span>
  );
}

function Heading({ children, variant, as: Component = 'h2', ...props }: { children: ReactNode; variant?: string; as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; [key: string]: any }) {
  const variantClasses: Record<string, string> = {
    'display-strong-s': 'text-2xl font-bold text-gray-900 dark:text-white',
    'display-strong-m': 'text-3xl font-bold text-gray-900 dark:text-white',
    'display-strong-l': 'text-4xl font-bold text-gray-900 dark:text-white',
    'heading-strong-m': 'text-lg font-semibold text-gray-900 dark:text-white',
    'heading-strong-l': 'text-xl font-semibold text-gray-900 dark:text-white',
  };

  return (
    <Component className={variantClasses[variant || 'display-strong-s']} {...props}>
      {children}
    </Component>
  );
}

function Button({ children, href, variant = 'primary', size = 'm', ...props }: { children: ReactNode; href?: string; variant?: string; size?: string; [key: string]: any }) {
  const baseClasses = 'inline-flex items-center gap-2 rounded-lg font-medium transition-colors';
  const variantClasses: Record<string, string> = {
    primary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    secondary: 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800',
    tertiary: 'text-cyan-600 dark:text-cyan-400 hover:underline',
  };
  const sizeClasses: Record<string, string> = {
    s: 'px-3 py-1.5 text-sm',
    m: 'px-4 py-2 text-base',
    l: 'px-6 py-3 text-lg',
  };

  const className = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.m}`;

  if (href) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function Row({ children, gap, ...props }: { children: ReactNode; gap?: string; [key: string]: any }) {
  const gapClass = gap ? `gap-${gap}` : 'gap-4';
  return (
    <div className={`flex flex-row ${gapClass}`} {...props}>
      {children}
    </div>
  );
}

function Column({ children, gap, ...props }: { children: ReactNode; gap?: string; [key: string]: any }) {
  const gapClass = gap ? `gap-${gap}` : 'gap-4';
  return (
    <div className={`flex flex-col ${gapClass}`} {...props}>
      {children}
    </div>
  );
}

function Grid({ children, columns = '2', gap, ...props }: { children: ReactNode; columns?: string; gap?: string; [key: string]: any }) {
  const gapClass = gap ? `gap-${gap}` : 'gap-4';
  const colClasses: Record<string, string> = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-2',
    '3': 'grid-cols-3',
    '4': 'grid-cols-4',
  };
  return (
    <div className={`grid ${colClasses[columns] || 'grid-cols-2'} ${gapClass}`} {...props}>
      {children}
    </div>
  );
}

function Card({ children, ...props }: { children: ReactNode; [key: string]: any }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" {...props}>
      {children}
    </div>
  );
}

function Media({ src, alt, ...props }: MediaProps & { [key: string]: any }) {
  return createImage({ src, alt, ...props });
}

function SmartLink({ href, children, ...props }: CustomLinkProps) {
  return <CustomLink href={href} {...props}>{children}</CustomLink>;
}

function Table({ children, ...props }: { children: ReactNode; [key: string]: any }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </table>
    </div>
  );
}

function Accordion({ title, children, ...props }: { title: string; children: ReactNode; [key: string]: any }) {
  return (
    <details className="my-2 border border-gray-200 dark:border-gray-700 rounded-lg" {...props}>
      <summary className="px-4 py-2 cursor-pointer font-medium text-gray-900 dark:text-white">
        {title}
      </summary>
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </details>
  );
}

function AccordionGroup({ children, ...props }: { children: ReactNode; [key: string]: any }) {
  return (
    <div className="flex flex-col gap-2" {...props}>
      {children}
    </div>
  );
}

function Feedback({ type = 'info', children, ...props }: { type?: 'info' | 'warning' | 'error' | 'success'; children: ReactNode; [key: string]: any }) {
  const typeClasses: Record<string, string> = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  };

  return (
    <div className={`p-4 my-4 rounded-lg border ${typeClasses[type]}`} {...props}>
      {children}
    </div>
  );
}

function Icon({ name, size = 'm', ...props }: { name: string; size?: 's' | 'm' | 'l'; [key: string]: any }) {
  // Simplified icon - just shows the name
  const sizeClasses: Record<string, string> = {
    s: 'w-4 h-4',
    m: 'w-5 h-5',
    l: 'w-6 h-6',
  };
  return (
    <span className={`inline-block ${sizeClasses[size]}`} {...props}>
      [{name}]
    </span>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return createInlineCode({ children });
}

function CodeBlock({ codes, copyButton = true }: { codes: { code: string; language: string; label: string }[]; copyButton?: boolean }) {
  if (!codes || codes.length === 0) return null;

  const { code, language, label } = codes[0];

  return (
    <div className="mt-2 mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{label}</span>
        {copyButton && <CopyButton text={code} />}
      </div>
      <pre className="p-4 overflow-x-auto bg-gray-50 dark:bg-gray-900">
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{code}</code>
      </pre>
    </div>
  );
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />
  );
}
