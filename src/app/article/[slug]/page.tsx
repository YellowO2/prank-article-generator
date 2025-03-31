// src/app/article/[slug]/page.tsx
// import styles from "./article.module.css";
import { findArticleBySlug, incrementViewCount } from "@/database-functions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
// Import the NEW Client Component
import ArticleClientPart from "../ArticleClientPart"; // Adjust path if you placed it elsewhere

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // Await params if it's a Promise
  const slug = resolvedParams.slug;

  const article = await findArticleBySlug(slug);

  // Decide when to increment view count - doing it here means it increments
  // even if the page data is just used for metadata generation.
  // Consider moving incrementViewCount to the main Article component fetch below
  // if you only want it to count when the full page is rendered.
  if (article) {
    // Only increment if article exists
    await incrementViewCount(slug); // Make sure incrementViewCount is awaited if it's async
    // Re-fetch article if view count needs to be absolutely up-to-date for metadata (unlikely needed)
  }

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: article.headline,
    description: article.content.substring(0, 160) + "...",
    // Add other metadata
  };
}

// Default export Server Component
export default async function Article({ params }: Props) {
  // Remove unnecessary 'params = await params'
  const resolvedParams = await params; // Await params if it's a Promise
  const slug = resolvedParams.slug;
  const article = await findArticleBySlug(slug);

  // Increment view count here might be more accurate for actual page views
  // if (!article) { /* handle notFound */ } else { await incrementViewCount(slug); }
  // Fetch article *again* after increment if you want the absolute latest count passed down
  // const articleWithUpdatedViews = await findArticleBySlug(slug); // Optional re-fetch

  if (!article) {
    notFound();
  }

  // Process paragraphs here on the server
  const paragraphs = article.content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Render the Client Component and pass data down
  return (
    // Pass the fetched article data (potentially re-fetched for view count)
    // and the processed paragraphs to the client component
    <ArticleClientPart
      article={article} // Or articleWithUpdatedViews if you re-fetched
      paragraphs={paragraphs}
    />
  );
}
