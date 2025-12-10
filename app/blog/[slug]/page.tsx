import { getBlogPostBySlug, getAssetUrl } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// Rich text rendering options for Contentful
const richTextOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-4">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="mb-1">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-brand-gold pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data?.target?.fields || {};
      if (file?.url) {
        return (
          <div className="relative w-full h-64 my-6">
            <Image
              src={`https:${file.url}`}
              alt={title || "Embedded image"}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        );
      }
      return null;
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-gold hover:underline"
      >
        {children}
      </a>
    ),
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Sherrilynn Breathwork`,
    description: post.excerpt || "Read our latest blog post.",
    openGraph: {
      images: post.mainImage ? [getAssetUrl(post.mainImage)] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <FadeIn>
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-brand-gold transition-colors mb-4 inline-block"
            >
              ← Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {post.title}
            </h1>
            <p className="text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {post.mainImage && (
            <div className="relative w-full h-[400px] mb-10 rounded-xl overflow-hidden">
              <Image
                src={getAssetUrl(post.mainImage)}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground">
            {post.body && documentToReactComponents(post.body, richTextOptions)}
          </div>
        </article>
      </FadeIn>
    </div>
  );
}
