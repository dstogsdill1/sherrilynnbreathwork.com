import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getAssetUrl } from "@/lib/contentful";
import { FadeIn } from "@/components/fade-in";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
            Resources & Insights
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Explore articles on breathwork, healing, and personal growth.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <FadeIn key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  {post.mainImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={getAssetUrl(post.mainImage)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 text-primary font-medium text-sm">
                      Read more →
                    </div>
                  </div>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
        
        {posts.length === 0 && (
            <div className="text-center py-20">
                <p className="text-muted-foreground">No posts found. Check back soon!</p>
            </div>
        )}
      </div>
    </main>
  );
}
