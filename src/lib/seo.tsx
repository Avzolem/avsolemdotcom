import { Metadata } from 'next';

interface MetaGenerateParams {
  title: string;
  description: string;
  baseURL: string;
  path?: string;
  image?: string;
  canonical?: string;
}

interface SchemaWebPageParams {
  baseURL: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  author?: {
    name: string;
    url?: string;
    image?: string;
  };
}

interface SchemaArticleParams {
  baseURL: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  publishedAt: string;
  modifiedAt?: string;
  author?: {
    name: string;
    url?: string;
    image?: string;
  };
}

// Meta generation utility
export const Meta = {
  generate: ({
    title,
    description,
    baseURL,
    path = '',
    image,
    canonical,
  }: MetaGenerateParams): Metadata => {
    const url = `${baseURL}${path}`;
    const ogImage = image
      ? image.startsWith('http') ? image : `${baseURL}${image}`
      : `${baseURL}/api/og/generate?title=${encodeURIComponent(title)}`;

    return {
      title,
      description,
      metadataBase: new URL(baseURL),
      alternates: {
        canonical: canonical || url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: title,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  },
};

// Schema.org structured data components
export const Schema = {
  WebPage: ({
    baseURL,
    path,
    title,
    description,
    image,
    author,
  }: SchemaWebPageParams) => {
    const url = `${baseURL}${path}`;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url,
      ...(image && { image: image.startsWith('http') ? image : `${baseURL}${image}` }),
      ...(author && {
        author: {
          '@type': 'Person',
          name: author.name,
          ...(author.url && { url: author.url }),
          ...(author.image && { image: author.image }),
        },
      }),
    };

    return schema;
  },

  Article: ({
    baseURL,
    path,
    title,
    description,
    image,
    publishedAt,
    modifiedAt,
    author,
  }: SchemaArticleParams) => {
    const url = `${baseURL}${path}`;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      datePublished: publishedAt,
      ...(modifiedAt && { dateModified: modifiedAt }),
      ...(image && { image: image.startsWith('http') ? image : `${baseURL}${image}` }),
      ...(author && {
        author: {
          '@type': 'Person',
          name: author.name,
          ...(author.url && { url: author.url }),
          ...(author.image && { image: author.image }),
        },
      }),
    };

    return schema;
  },
};

// React component for Schema injection
interface SchemaComponentProps {
  as: 'webPage' | 'article' | 'blogPosting';
  baseURL: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: {
    name: string;
    url?: string;
    image?: string;
  };
}

export function SchemaScript({
  as,
  baseURL,
  path,
  title,
  description,
  image,
  publishedAt,
  modifiedAt,
  author,
}: SchemaComponentProps) {
  let schema;

  if (as === 'webPage') {
    schema = Schema.WebPage({ baseURL, path, title, description, image, author });
  } else if ((as === 'article' || as === 'blogPosting') && publishedAt) {
    schema = Schema.Article({ baseURL, path, title, description, image, publishedAt, modifiedAt, author });
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
